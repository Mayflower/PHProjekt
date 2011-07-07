<?php
/**
 * Todo model class
 *
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * @category   PHProjekt
 * @package    Application
 * @subpackage Todo
 * @copyright  Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 * @version    Release: @package_version@
 * @author     Gustavo Solt <solt@mayflower.de>
 */

/**
 * Todo model class
 *
 * @category   PHProjekt
 * @package    Application
 * @subpackage Todo
 * @copyright  Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 * @version    Release: @package_version@
 * @author     Gustavo Solt <solt@mayflower.de>
 */
class Todo_Models_Todo extends Phprojekt_Item_Abstract
{

    /** Constants for $this->currentStatus */
    const STATUS_WAITING  = 1;
    const STATUS_ACCEPTED = 2;
    const STATUS_WORKING  = 3;
    const STATUS_STOPPED  = 4;
    const STATUS_ENDED    = 5;

    /**
     * Returns an instance of notification class for this module
     *
     * @return Phprojekt_Notification An instance of Phprojekt_Notification.
     */
    public function getNotification()
    {
        $notification = Phprojekt_Loader::getModel('Todo', 'Notification');
        $notification->setModel($this);

        return $notification;
    }

    /**
     * Validate the data of the current record.
     *
     * @return boolean True for valid.
     */
    public function recordValidate()
    {
        $validDate = $this->_validate->validateDateRange(
            $this->startDate,
            $this->endDate
        );

        if (!$validDate) {
            return false;
        } else {
            return parent::recordValidate();
        }
    }

    /**
     * Overwrite the save function and delete this project's completion cache.
     */
    public function save()
    {
        parent::save();
        $project = new Project_Models_Project();
        $project->find(Phprojekt::getCurrentProjectId());
        $project->deleteCumulativeCompletePercentCache();
    }

    /**
     * Overwrite the delete function and delete this project's completion cache.
     */
    public function delete()
    {
        $project = new Project_Models_Project();
        $project->find(Phprojekt::getCurrentProjectId());
        $project->deleteCumulativeCompletePercentCache();
        parent::delete();
    }
}
