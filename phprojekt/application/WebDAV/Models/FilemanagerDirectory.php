<?php
/**
 * WebDAV collection model.
 *
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details
 *
 * @category   PHProjekt
 * @package    Application
 * @subpackage WebDAV
 * @copyright  Copyright (c) 2012 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.1.4
 * @author     Simon Kohlmeyer <simon.kohlmeyer@mayflower.de>
 */

/**
 * WebDAV collection model.
 *
 * A directory in the webdav structure. Maps to a filemanager item.
 *
 * @category   PHProjekt
 * @package    Application
 * @subpackage WebDAV
 * @copyright  Copyright (c) 2012 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.1.4
 * @author     Simon Kohlmeyer <simon.kohlmeyer@mayflower.de>
 */
class WebDAV_Models_FilemanagerDirectory extends Sabre_DAV_Collection
{
    protected $_filemanager;

    protected $_files = array();

    /**
     * Constructor
     *
     * @param Project_Models_Project $filemanager The filemanager that this object represents.
     */
    public function __construct(Filemanager_Models_Filemanager $filemanager)
    {
        $this->_filemanager = $filemanager;

        if ($filemanager->files) {
            foreach (explode('||', $filemanager->files) as $entry) {
                list($hash, $name) = explode('|', $entry, 2);
                $this->_files[$name] = $hash;
            }
        }
    }

    /**
     * Retrieves the child node with this specific name.
     *
     * @param string $name The name of the child node to get.
     */
    public function getChild($name)
    {
        if (array_key_exists($name, $this->_files)) {
            return new WebDAV_Models_FilemanagerFile($name, $this->_files[$name], $this->_filemanager);
        } else {
            throw new Sabre_DAV_Exception_NotFound('File not found: ' . $name);
        }
    }

    /**
     * Checks if a child with the given name exists.
     *
     * @param string $name The name of the child.
     */
    public function childExists($name)
    {
        return array_key_exists($name, $this->_files);
    }

    public function createFile($name, $data = NULL)
    {
        $hash = md5(mt_rand() . time());
        $newPath = Phprojekt::getInstance()->getConfig()->uploadPath . '/' . $hash;
        if (false === file_put_contents($newPath, $data)) {
            throw new Phprojekt_Exception_IOException('saving failed');
        }

        if (!empty($this->_filemanager->files)) {
            $this->_filemanager->files .= '||';
        }
        $this->_filemanager->files .= $hash . '|' . $name;

        try {
            $this->_filemanager->save();
        } catch (Exception $e) {
            unlink($newPath);
            throw $e;
        }

    }

    public function createDirectory($name)
    {
        throw new Sabre_DAV_Exception_NotImplemented(
            'Directories can only be created in the "Filemanagers" subdirectories of projects'
        );
    }

    public function getName()
    {
        return $this->_filemanager->title;
    }

    public function getChildren()
    {
        $children = array();
        foreach ($this->_files as $name => $hash) {
            $children[] = new WebDAV_Models_FilemanagerFile($name, $hash, $this->_filemanager);
        }
        return $children;
    }

    public function setName($name)
    {
        $this->_filemanager->title = $name;
        $this->_filemanager->save();
    }

    public function delete()
    {
        $this->_filemanager->delete();
    }
}