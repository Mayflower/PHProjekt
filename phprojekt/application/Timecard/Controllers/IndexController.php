<?php
/**
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * @copyright  Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 */

/**
 * Timecard Module Controller.
 */
class Timecard_IndexController extends IndexController
{
    public function init()
    {
        $format = $this->getRequest()->getParam('format', null);
        if (empty($format)) {
            $this->getRequest()->setParam('format', 'json');
        }

        $this->_helper->getHelper('contextSwitch')
            ->setAutoJsonSerialization(false)
            ->setContext(
                'csv',
                array(
                    'suffix' => 'csv',
                    'headers' => array(
                        'Content-Type' => 'application/csv',
                        'Content-Disposition' => 'inline; filename="export-' . date('Ymd_his') . '.csv"',
                        'Pragma' => 'no-cache',
                        'Expires' => '0',
                    )
                )
            )->clearActionContexts()
            ->setActionContexts(
                array(
                    'recentProjects' => array('json', 'csv'),
                    'bookedProjects' => array('json', 'csv'),
                    'minutesBooked' => array('json', 'csv'),
                    'minutesToWork' => array('json', 'csv'),
                    'workBalanceByDay' => array('json', 'csv'),
                    'workedMinutesPerDay' => array('json', 'csv'),
                    'projectUserMinutes' => array('json', 'csv'),
                    'projectMemberBookings' => array('json', 'csv')
                ))
            ->initContext();
        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('viewRenderer');
        $viewRenderer->setViewScriptPathSpec('index.:suffix');
    }

    /**
     * Keep in the session the current project id
     *
     * @return void
     */
    public function setCurrentProjectId()
    {
        Phprojekt::setCurrentProjectId(self::INVISIBLE_ROOT);
    }

    /**
     * Returns a list of the days in the given range with the sum of bookings per day.
     *
     * For each day in the return, the data have:
     * <pre>
     *  - date         => Iso date.
     *  - sumInMinutes => Sum of bookings of that day
     * </pre>
     *
     * OPTIONAL request parameters:
     * <pre>
     *  - integer <b>start</b>  The start date.
     *  - integer <b>end</b> The end date (exclusive).
     * </pre>
     *
     * @return void
     */
    public function workedMinutesPerDayAction()
    {
        list($start, $end) = $this->_paramToStartEndDT();
        $projects          = $this->_projectsParamToArray();
        $records           = Timecard_Models_Timecard::getRecords($start, $end, $projects);

        $this->view->records = array('days' => $records['data']);
    }


    /**
     * Returns a list of the bookings in a day.
     *
     * For each booking, the data have:
     * <pre>
     *  - id        => id of the booking record.
     *  - projectId => id of the booking project.
     *  - startTime => HH:mm:ss of the start time.
     *  - endTime   => HH:mm:ss of the end time.
     *  - display   => Display for the booking project.
     * </pre>
     *
     * OPTIONAL request parameters:
     * <pre>
     *  - date <b>date</b> Iso date to consult.
     * </pre>
     *
     * The return is in JSON format.
     *
     * @return void
     */
    public function jsonDayListAction()
    {
        $date    = Cleaner::sanitize('date', $this->getRequest()->getParam('date', date("Y-m-d")));
        $records = $this->getModelObject()->getDayRecords($date);

        Phprojekt_Converter_Json::echoConvert($records, Phprojekt_ModelInformation_Default::ORDERING_FORM);
    }

    /**
     * Returns the n most recent projects used for bookings sorted in desc
     * order.
     *
     * Request params:
     * <pre>
     *  - integer <b>n</b> How many recent projects should be returned,defaults
     *  to 5
     * </pre>
     */
    public function recentProjectsAction()
    {
        $n = (int) $this->getRequest()->getParam('n', 5);

        $ownerId = Phprojekt_Auth_Proxy::getEffectiveUserId();
        $model   = $this->getModelObject();
        $records = $model->getRecentBookedProjects($ownerId, $n);
        $this->view->records = $records;
    }

    /**
     * Returns the n most recent projects used for bookings sorted in desc
     * order.
     */
    public function bookedProjectsAction()
    {
        $records = Timecard_Models_Timecard::getBookedProjects();
        $this->view->records = $records;
    }

    /**
     * Return a list of Project (Ids and Names) saved as "favorites"
     *
     * For each one, the data have:
     * <pre>
     *  - id      => id of the project.
     *  - display => Display for the project.
     *  - name    => Real name of the project.
     * </pre>
     *
     * The return is in JSON format.
     *
     * @return void
     */
    public function jsonGetFavoritesProjectsAction()
    {
        $setting = new Phprojekt_Setting();
        $setting->setModule('Timecard');

        $favorites = $setting->getSetting('favorites');
        if (!empty($favorites)) {
            $favorites = unserialize($favorites);
        } else {
            $favorites = array();
        }

        $activeRecord = new Project_Models_Project();
        $tree         = new Phprojekt_Tree_Node_Database($activeRecord, 1);
        $tree         = $tree->setup();

        $datas = array();
        if (is_array($favorites)) {
            foreach ($favorites as $projectId) {
                foreach ($tree as $node) {
                    if ($node->id == $projectId) {
                        $data            = array();
                        $data['id']      = $projectId;
                        $data['display'] = $node->getDepthDisplay('title');
                        $data['name']    = $node->title;

                        $datas[] = $data;
                    }
                }
            }
        }

        Phprojekt_Converter_Json::echoConvert($datas);
    }

    /**
     * Returns the currently running booking on the given day or null.
     *
     * It returns a string in JSON format with:
     * <pre>
     *  - type   => 'success'.
     *  - data   =>
     *      - id        => id of the booking record.
     *      - projectId => id of the booking project.
     *      - startTime => HH:mm:ss of the start time.
     *      - endTime   => HH:mm:ss of the end time.
     *      - note      => The notes of the booking if any.
     *  - id     => 0.
     * </pre>
     *
     * @return void
     */
    public function jsonGetRunningBookingsAction()
    {
        $year = (int) $this->getRequest()->getParam('year', date("Y"));
        $month = (int) $this->getRequest()->getParam('month', date("m"));
        $date = (int) $this->getRequest()->getParam('date', date("j"));
        $record = Timecard_Models_Timecard::getRunningBooking($year, $month, $date);
        if ($record) {
            $data['id']        = $record['id'];
            $data['projectId'] = $record['project_id'];
            $data['startTime'] = substr($record['start_datetime'], 11);
            $data['endTime']   = $record['end_time'];
            $data['note']      = $record['notes'];
        } else {
            $data = null;
        }

        $return = array('type'    => 'success',
                        'data'    => $data,
                        'id'      => 0);

        Phprojekt_Converter_Json::echoConvert($return);
    }

    /**
     * Saves a booking.
     *
     * If the request parameter "id" is null or 0, the function will add a new booking,
     * if the "id" is an existing booking, the function will update it.
     *
     * OPTIONAL request parameters:
     * <pre>
     *  - integer <b>id</b>                      id of the booking to save.
     *  - mixed   <b>all other module fields</b> All the fields values to save.
     * </pre>
     *
     * If there is an error, the save will return a Zend_Controller_Action_Exception,
     * if not, it returns a string in JSON format with:
     * <pre>
     *  - type    => 'success'.
     *  - message => Success message.
     *  - id      => Id of the booking.
     * </pre>
     *
     * @throws Zend_Controller_Action_Exception On error in the action save or wrong id.
     *
     * @return void
     */
    public function jsonSaveAction()
    {
        $id = (int) $this->getRequest()->getParam('id');
        $this->setCurrentProjectId();

        if (empty($id)) {
            $model   = $this->getModelObject();
            $message = Phprojekt::getInstance()->translate(self::ADD_TRUE_TEXT);
        } else {
            $model   = $this->getModelObject()->find($id);
            $message = Phprojekt::getInstance()->translate(self::EDIT_TRUE_TEXT);
        }

        $params = $this->setParams($this->getRequest()->getParams(), $model);
        Default_Helpers_Save::save($model, $params);

        $return = array('type'    => 'success',
                        'message' => $message,
                        'id'      => $model->id);

        Phprojekt_Converter_Json::echoConvert($return);
    }

    /**
     * Save the favorites projects for the current user.
     *
     * OPTIONAL request parameters:
     * <pre>
     *  - array <b>favorites</b> Array with ids of the projects.
     * </pre>
     *
     * The return is a string in JSON format with:
     * <pre>
     *  - type    => 'success'.
     *  - message => Success message.
     *  - id      => 0.
     * </pre>
     *
     * @return void
     */
    public function jsonFavoritesSaveAction()
    {
        $setting = new Phprojekt_Setting();
        $setting->setModule('Timecard');

        $setting->setSettings($this->getRequest()->getParams());

        $message = Phprojekt::getInstance()->translate(self::EDIT_TRUE_TEXT);
        $return  = array('type'    => 'success',
                         'message' => $message,
                         'id'      => 0);

        Phprojekt_Converter_Json::echoConvert($return);
    }

    /**
     * Returns the list of the bookings in the month.
     *
     * The function use Phprojekt_ModelInformation_Default::ORDERING_LIST for get and sort the fields.
     *
     * OPTIONAL request parameters:
     * <pre>
     *  - integer <b>year</b>  Year to consult.
     *  - integer <b>month</b> Month to consult.
     * </pre>
     *
     * The return is in CSV format.
     *
     * @return void
     */
    public function csvListAction()
    {
        $db     = Phprojekt::getInstance()->getDb();
        $userId = Phprojekt_Auth::getUserId();
        $year   = (int) $this->getRequest()->getParam('year', date("Y"));
        $month  = (int) $this->getRequest()->getParam('month', date("m"));
        if (strlen($month) == 1) {
            $month = '0' . $month;
        }
        $where = sprintf('(owner_id = %d AND DATE(start_datetime) LIKE %s)', (int) $userId,
            $db->quote($year . '-' . $month . '-%'));
        $this->setCurrentProjectId();
        $records = $this->getModelObject()->fetchAll($where, 'start_datetime ASC');

        Phprojekt_Converter_Csv::echoConvert($records);
    }

    /**
     * Retrieves the minutes booked in the given time period.
     */
    public function minutesBookedAction()
    {
        list($start, $end) = $this->_paramToStartEndDT();
        $projects          = $this->_projectsParamToArray();
        $minutes           = Timecard_Models_Timecard::getBookedMinutes($start, $end, $projects);

        $this->view->records = array('minutesBooked' => $minutes);
    }

    /**
     * Set some values deppend on the params
     *
     * Sanitize some values and calculate the minutes value.
     *
     * @return array
     */
    public function setParams()
    {
        $args = func_get_args();

        $params = $args[0];
        $model  = $args[1];

        $params['startDatetime'] = Cleaner::sanitize('datetime', $params['startDatetime']);
        if (isset($params['endTime'])) {
            $params['endTime'] = Cleaner::sanitize('time', $params['endTime']);
            if ($params['endTime'] == '') {
                unset($params['endTime']);
            }
        }
        $params['projectId'] = (int) $params['projectId'];
        $params['notes']     = Cleaner::sanitize('string', $params['notes']);

        if (isset($params['endTime']) && isset($params['startDatetime'])) {
            $params['minutes'] = Timecard_Models_Timecard::getDiffTime($params['endTime'],
                substr($params['startDatetime'], 11));
        } else if (!isset($params['endTime'])) {
            $params['minutes'] = 0;
        } else {
            $params['minutes'] = Timecard_Models_Timecard::getDiffTime($params['endTime'],
                substr($model->startDatetime, 11));
        }

        return $params;
    }

    /**
     * Retrieve the mintes to work in a specific month based on the contract of the current user.
     *
     * Parameters: int month The month in question (1-12). Defaults to the current month.
     *             int year The year. Defaults to the current year.
     *
     * Returns: "{minutesToWork: <int>}"
     */
    public function minutesToWorkAction()
    {
        list($start, $end) = $this->_paramToStartEndDT();

        $contracts     = Timecard_Models_Contract::fetchByUserAndPeriod(Phprojekt_Auth_Proxy::getEffectiveUser(), $start, $end);
        $minutesPerDay = $this->_contractsToMinutesPerDay($contracts, $start, $end);
        $minutesPerDay = $this->_applyHolidayWeights($minutesPerDay, $start, $end);

        $minutes = 0;
        foreach ($minutesPerDay as $d) {
            $minutes += $d;
        }

        $this->view->records = array('minutesToWork' => $minutes);
    }

    public function workBalanceByDayAction()
    {
        list($start, $end) = $this->_paramToStartEndDT();

        $projects = $this->_projectsParamToArray();

        $user = Phprojekt_Auth_Proxy::getEffectiveUser();
        $contracts = Timecard_Models_Contract::fetchByUserAndPeriod($user, $start, $end);
        $minutesToWorkPerDay = $this->_contractsToMinutesPerDay($contracts, $start, $end);
        $minutesToWorkPerDay = $this->_applyHolidayWeights($minutesToWorkPerDay, $start, $end);

        $bookings = Phprojekt::getInstance()->getDb()->select()
            ->from('timecard', array('date' => 'DATE(start_datetime)', 'minutes'))
            ->where('owner_id = ?', $user->id)
            ->where('DATE(start_datetime) >= ?', $start->format('Y-m-d'))
            ->where('DATE(start_datetime) < ?', $end->format('Y-m-d'));

        if (!empty($projects)) {
            $bookings->where('project_id IN (?)', $projects);
        }

        $bookings->order('date ASC');

        $bookings = $bookings->query()->fetchAll();

        $ret = array();
        foreach ($minutesToWorkPerDay as $day => $minutesToWork) {
            $minutesBooked = 0;
            while (!empty($bookings) && $bookings[0]['date'] == $day) {
                $b = array_shift($bookings);
                $minutesBooked += $b['minutes'];
            }
            $ret[$day] = array(
                'minutesToWork' => $minutesToWork,
                'minutesBooked' => $minutesBooked,
            );
        }

        $this->view->records = array('workBalancePerDay' => $ret);
    }

    public function projectUserMinutesAction()
    {
        $startDate  = new DateTime($this->_getDateStringParam('start'));
        $endDate    = new DateTime($this->_getDateStringParam('end'));
        $userIds    = explode(',', $this->getRequest()->getParam('users', Phprojekt_Auth::getUserId()));

        foreach ($userIds as $id) {
            if (preg_match('/^\d+$/', $id) !== 1) {
                throw new Exception('malformed request');
            }
        }

        $entries = Timecard_Models_Timecard::getProjectMinutesByUsers($userIds, $startDate, $endDate);

        $this->view->records = array('projectUserMinutes' => $entries);
    }

    public function projectMemberBookingsAction()
    {
        $projects = $this->_projectsParamToArray();
        list($start, $end) = $this->_paramToStartEndDT();

        if (!is_array($projects) || empty($projects)) {
            throw new Exception('No projects specified');
        }

        $this->view->records = Timecard_Models_Timecard::getMemberBookings($projects, $start, $end);
    }

    private function _paramToStartEndDT()
    {
        $start = $this->getRequest()->getParam('start');

        /* either given start day or the start day of the contract. */
        $contracts = Timecard_Models_Contract::fetchByUser(Phprojekt_Auth_Proxy::getEffectiveUser());

        $first = array_pop($contracts);
        $start = (null === $start) ? $first['start'] : new \DateTime($start);

        $end = new \DateTime($this->getRequest()->getParam('end', 'today'));

        return [$start, $end];
    }

    private function _projectsParamToArray()
    {
        $projects = trim($this->getRequest()->getParam('projects', ''));
        return $projects === '' ? null : explode(',', $projects);
    }

    /**
     * The contracts are only used for $start to $end
     */
    private function _contractsToMinutesPerDay(array $contracts, DateTime $start, DateTime $end)
    {
        $minutesPerDay = array();
        foreach ($contracts as $c) {
            $period = new DatePeriod(
                $s = empty($c['start']) ? $start : $this->_dateMax($c['start'], $start),
                new DateInterval('P1D'),
                $e = empty($c['end'])   ? $end   : $this->_dateMin($c['end'], $end)
            );

            foreach ($period as $d) {
                if ($d->format('N') >= 6) {
                    // Weekend
                    $minutesPerDay[$d->format('Y-m-d')] = 0;
                } else {
                    $minutesPerDay[$d->format('Y-m-d')] = $c['contract']->hoursPerWeek * 60 / 5;
                }
            }
        }

        return $minutesPerDay;
    }

    private function _applyHolidayWeights(array $minutesPerDay, DateTime $start, DateTime $end)
    {
        try {
            $holidays = Phprojekt_Auth_Proxy::getEffectiveUser()->getHolidayCalculator()->between($start, $end);
        } catch (Phprojekt_Exception_HolidayRegionNotSet $e) {
            return $minutesPerDay;
        }
        $holidaysByDate = array();
        foreach ($holidays as $h) {
            $dateString = $h->format('Y-m-d');
            if (array_key_exists($dateString, $minutesPerDay)) {
                $minutesPerDay[$dateString] *= (1 - $h->weight);
            }
        }

        return $minutesPerDay;
    }

    private function _dateBefore(DateTime $a, DateTime $b)
    {
        $aY = (int) $a->format('Y');
        $am = (int) $a->format('m');
        $ad = (int) $a->format('d');
        $bY = (int) $b->format('Y');
        $bm = (int) $b->format('m');
        $bd = (int) $b->format('d');

        return ($aY < $bY) ||
               ($aY == $bY && ($am < $bm) ||
                              ($am == $bm && $ad < $bd));
    }

    private function _dateMax(DateTime $a, DateTime $b)
    {
        return $this->_dateBefore($a, $b) ? $b : $a;
    }

    private function _dateMin(DateTime $a, DateTime $b)
    {
        return $this->_dateBefore($a, $b) ? $a : $b;
    }
}
