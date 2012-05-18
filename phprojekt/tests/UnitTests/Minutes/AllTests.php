<?php
/**
 * Test suite for the Minutes module
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
 * @package    UnitTests
 * @subpackage Minutes
 * @copyright  Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 * @version    Release: 6.1.1
 * @author     Sven Rautenberg <sven.rautenberg@mayflower.de>
*/

if (!defined('PHPUnit_MAIN_METHOD')) {
    define('PHPUnit_MAIN_METHOD', 'Default_AllTests::main');
}

require_once 'PHPUnit/TextUI/TestRunner.php';

require_once 'Helpers/UserlistTest.php';
require_once 'Controllers/IndexControllerTest.php';
require_once 'Controllers/ItemControllerTest.php';

/**
 * Test suite for the Minutes module
 *
 * @category   PHProjekt
 * @package    UnitTests
 * @subpackage Minutes
 * @copyright  Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 * @version    Release: 6.1.1
 * @author     Sven Rautenberg <sven.rautenberg@mayflower.de>
 */
class Minutes_AllTests
{
    /**
     * Runs the test suite
     *
     */
    public static function main()
    {
        PHPUnit_TextUI_TestRunner::run(self::suite());
    }

    /**
     * Builds the test suite containing all
     * tests of this module and returns the suite
     *
     * @return PHPUnit_Framework_TestSuite
     */
    public static function suite()
    {
        $suite = new PHPUnit_Framework_TestSuite('Minutes Controller');

        $suite->addTestSuite('Minutes_Helpers_Userlist_Test');
        $suite->addTestSuite('Minutes_IndexController_Test');
        $suite->addTestSuite('Minutes_ItemController_Test');


        return $suite;
    }
}

if (PHPUnit_MAIN_METHOD == 'Minutes_AllTests::main') {
    Framework_AllTests::main();
}
