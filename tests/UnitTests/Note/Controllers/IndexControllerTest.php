<?php
/**
 * Unit test
 *
 * LICENSE: Licensed under the terms of the PHProjekt 6 License
 *
 * @copyright  Copyright (c) 2007 Mayflower GmbH (http://www.mayflower.de)
 * @license    http://phprojekt.com/license PHProjekt 6 License
 * @version    CVS: $Id:
 * @link       http://www.phprojekt.com
 * @since      File available since Release 1.0
*/
require_once 'PHPUnit/Framework.php';

/**
 * Tests for Index Controller
 *
 * @copyright  Copyright (c) 2007 Mayflower GmbH (http://www.mayflower.de)
 * @license    http://phprojekt.com/license PHProjekt 6 License
 * @version    Release: @package_version@
 * @link       http://www.phprojekt.com
 * @since      File available since Release 1.0
 * @author     Eduardo Polidor <polidor@mayflower.de>
 */
class Note_IndexController_Test extends PHPUnit_Framework_TestCase
{

    /**
     * Test of json save Note -in fact, default json save
     */
    public function testJsonSave()
    {
        $request = new Zend_Controller_Request_Http();
        $response = new Zend_Controller_Response_Http();

        $config = Zend_Registry::get('config');
        $config->language = "en";

        $request->setParams(array('action'=>'jsonSave','controller'=>'index','module'=>'Note'));

        $request->setBaseUrl($config->webpath.'index.php/Note/index/jsonSave/id/null/comments/test/projectId/1/title/test');
        $request->setPathInfo('/Note/index/jsonSave/id/null/comments/test/projectId/1/title/test');
        $request->setRequestUri('/Note/index/jsonSave/id/null/comments/test/projectId/1/title/test');

        // getting the view information
        $request->setModuleKey('module');
        $request->setControllerKey('controller');
        $request->setActionKey('action');
        $request->setDispatched(false);

        $view = new Zend_View();
        $view->addScriptPath(PHPR_CORE_PATH . '/Default/Views/dojo/');

        $viewRenderer = new Zend_Controller_Action_Helper_ViewRenderer($view);
        $viewRenderer->setViewBasePathSpec(':moduleDir/Views');
        $viewRenderer->setViewScriptPathSpec(':action.:suffix');

        Zend_Controller_Action_HelperBroker::addHelper($viewRenderer);

        // Languages Set
        Zend_Loader::loadClass('Phprojekt_Language', PHPR_LIBRARY_PATH);
        $translate = new Phprojekt_Language('en');
        Zend_Registry::set('translate', $translate);

        // Front controller stuff
        $front = Zend_Controller_Front::getInstance();
        $front->setDispatcher(new Phprojekt_Dispatcher());

        $front->registerPlugin(new Zend_Controller_Plugin_ErrorHandler());
        $front->setDefaultModule('Default');

        foreach (scandir(PHPR_CORE_PATH) as $module) {
            $dir = PHPR_CORE_PATH . DIRECTORY_SEPARATOR . $module;

            if (is_dir(!$dir)) {
                continue;
            }

            if (is_dir($dir . DIRECTORY_SEPARATOR . 'Controllers')) {
                $front->addModuleDirectory($dir);
            }

            $helperPath = $dir . DIRECTORY_SEPARATOR . 'Helpers';

            if (is_dir($helperPath)) {
                $view->addHelperPath($helperPath, $module . '_' . 'Helpers');
                Zend_Controller_Action_HelperBroker::addPath($helperPath);
            }
        }

        Zend_Registry::set('view', $view);
        $view->webPath  = $config->webpath;
        Zend_Registry::set('translate', $translate);

        $front->setModuleControllerDirectoryName('Controllers');
        $front->addModuleDirectory(PHPR_CORE_PATH);

        $front->setParam('useDefaultControllerAlways', true);

        $front->throwExceptions(true);

        // Getting the output, otherwise the home page will be displayed
        ob_start();

        $error_produced = false;

        try {
          $front->dispatch($request, $response);

        }
        catch (Phprojekt_PublishedException $e) {
            $error_produced = true;
        }
        $response = ob_get_contents();
        ob_end_clean();

        // checking some parts of the index template
        $this->assertTrue(strpos($response, 'The Item was added correctly') > 0);
    }


    /**
     * Test of json save  multiple Note
     */
    public function testJsonSaveMultiple()
    {
        $request = new Zend_Controller_Request_Http();
        $response = new Zend_Controller_Response_Http();

        $config = Zend_Registry::get('config');
        $config->language = "en";

        $request->setParams(array('action'=>'jsonSave','controller'=>'index','module'=>'Note'));

        $request->setBaseUrl($config->webpath.'index.php/Note/index/jsonSaveMultiple/nodeId/1/data[1][comments]/test save multiple');
        $request->setPathInfo('/Note/index/jsonSaveMultiple/nodeId/1/data[1][comments]/test save multiple');
        $request->setRequestUri('/Note/index/jsonSaveMultiple/nodeId/1/data[1][comments]/test save multiple');

        // getting the view information
        $request->setModuleKey('module');
        $request->setControllerKey('controller');
        $request->setActionKey('action');
        $request->setDispatched(false);

        $view = new Zend_View();
        $view->addScriptPath(PHPR_CORE_PATH . '/Default/Views/dojo/');

        $viewRenderer = new Zend_Controller_Action_Helper_ViewRenderer($view);
        $viewRenderer->setViewBasePathSpec(':moduleDir/Views');
        $viewRenderer->setViewScriptPathSpec(':action.:suffix');

        Zend_Controller_Action_HelperBroker::addHelper($viewRenderer);

        // Languages Set
        Zend_Loader::loadClass('Phprojekt_Language', PHPR_LIBRARY_PATH);
        $translate = new Phprojekt_Language('en');
        Zend_Registry::set('translate', $translate);

        // Front controller stuff
        $front = Zend_Controller_Front::getInstance();
        $front->setDispatcher(new Phprojekt_Dispatcher());

        $front->registerPlugin(new Zend_Controller_Plugin_ErrorHandler());
        $front->setDefaultModule('Default');

        foreach (scandir(PHPR_CORE_PATH) as $module) {
            $dir = PHPR_CORE_PATH . DIRECTORY_SEPARATOR . $module;

            if (is_dir(!$dir)) {
                continue;
            }

            if (is_dir($dir . DIRECTORY_SEPARATOR . 'Controllers')) {
                $front->addModuleDirectory($dir);
            }

            $helperPath = $dir . DIRECTORY_SEPARATOR . 'Helpers';

            if (is_dir($helperPath)) {
                $view->addHelperPath($helperPath, $module . '_' . 'Helpers');
                Zend_Controller_Action_HelperBroker::addPath($helperPath);
            }
        }

        Zend_Registry::set('view', $view);
        $view->webPath  = $config->webpath;
        Zend_Registry::set('translate', $translate);

        $front->setModuleControllerDirectoryName('Controllers');
        $front->addModuleDirectory(PHPR_CORE_PATH);

        $front->setParam('useDefaultControllerAlways', true);

        $front->throwExceptions(true);

        // Getting the output, otherwise the home page will be displayed
        ob_start();

        $error_produced = false;

        try {
          $front->dispatch($request, $response);

        }
        catch (Phprojekt_PublishedException $e) {
            $error_produced = true;
        }
        $response = ob_get_contents();
        ob_end_clean();

        // checking some parts of the index template
        $this->assertTrue(strpos($response, 'The Items was edited correctly') > 0);
    }



    /**
     * Test the note deletion
     */

    public function testJsonDeleteAction()
    {
        $request = new Zend_Controller_Request_Http();
        $response = new Zend_Controller_Response_Http();

        $config = Zend_Registry::get('config');

        $request->setParams(array('action'=>'jsonList','controller'=>'index','module'=>'Note'));

        $request->setBaseUrl($config->webpath.'index.php/Note/index/jsonDelete/id/1');
        $request->setPathInfo('/Note/index/jsonDelete/id/1');
        $request->setRequestUri('/Note/index/jsonDelete/id/1');

        // getting the view information
        $request->setModuleKey('module');
        $request->setControllerKey('controller');
        $request->setActionKey('action');
        $request->setDispatched(false);

        $view = new Zend_View();
        $view->addScriptPath(PHPR_CORE_PATH . '/Default/Views/dojo/');

        $viewRenderer = new Zend_Controller_Action_Helper_ViewRenderer($view);
        $viewRenderer->setViewBasePathSpec(':moduleDir/Views');
        $viewRenderer->setViewScriptPathSpec(':action.:suffix');

        Zend_Controller_Action_HelperBroker::addHelper($viewRenderer);

        // Languages Set
        Zend_Loader::loadClass('Phprojekt_Language', PHPR_LIBRARY_PATH);
        $translate = new Phprojekt_Language('en');
        Zend_Registry::set('translate', $translate);

        // Front controller stuff
        $front = Zend_Controller_Front::getInstance();
        $front->setDispatcher(new Phprojekt_Dispatcher());

        $front->registerPlugin(new Zend_Controller_Plugin_ErrorHandler());
        $front->setDefaultModule('Default');

        foreach (scandir(PHPR_CORE_PATH) as $module) {
            $dir = PHPR_CORE_PATH . DIRECTORY_SEPARATOR . $module;

            if (is_dir(!$dir)) {
                continue;
            }

            if (is_dir($dir . DIRECTORY_SEPARATOR . 'Controllers')) {
                $front->addModuleDirectory($dir);
            }

            $helperPath = $dir . DIRECTORY_SEPARATOR . 'Helpers';

            if (is_dir($helperPath)) {
                $view->addHelperPath($helperPath, $module . '_' . 'Helpers');
                Zend_Controller_Action_HelperBroker::addPath($helperPath);
            }
        }

        Zend_Registry::set('view', $view);
        $view->webPath  = $config->webpath;
        Zend_Registry::set('translate', $translate);

        $front->setModuleControllerDirectoryName('Controllers');
        $front->addModuleDirectory(PHPR_CORE_PATH);

        $front->setParam('useDefaultControllerAlways', true);

        $front->throwExceptions(true);

        // Getting the output, otherwise the home page will be displayed
        ob_start();

        $front->dispatch($request, $response);
        $response = ob_get_contents();

        ob_end_clean();

        // checking some parts of the index template
        $this->assertTrue(strpos($response, 'The Item was deleted correctly') > 0);
    }



}