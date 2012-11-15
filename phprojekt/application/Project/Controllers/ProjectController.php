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
 * Project Module Controller.
 */
class Project_ProjectController extends Phprojekt_RestController
{
    /**
     * Overwrite to hide deleted projects
     */
    public function getFilterWhere($where = null)
    {
        $where  = parent::getFilterWhere($where);
        $where  = $where ? '(' . $where . ') AND ' : '';
        $where .= 'deleted = False';
        return $where;
    }
}
