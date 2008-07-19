<?php
/**
 * Convert a model into a CSV structure.
 *
 * @copyright 2007 Mayflower GmbH (http://www.mayflower.de)
 * @license   http://www.phprojekt.com/license PHProjekt6 License
 * @version   CVS: $Id: Csv.php 828 2008-07-07 02:05:54Z gustavo $
 * @author    Eduardo Polidor <polidor@mayflower.de>
 * @package   PHProjekt
 * @subpackage Core
 * @link      http://www.phprojekt.com
 * @since     File available since Release 1.0
 */

/**
 * Convert a model into a CSV structure.
 *
 * @copyright  2007 Mayflower GmbH (http://www.mayflower.de)
 * @version    Release: @package_version@
 * @license    http://www.phprojekt.com/license PHProjekt6 License
 * @author     Eduardo Polidor <polidor@mayflower.de>
 * @package    PHProjekt
 * @subpackage Core
 * @link       http://www.phprojekt.com
 * @since      File available since Release 1.0
 */
class Phprojekt_Converter_Csv
{
    /**
     * The function check the parameters type
     * and choose which convert function must use
     *
     * @param mix $param1 - Array
     * @param mix $param2 - ORDERING_LIST for items / fieldInformation for tags
     *
     * @return string
     */
    static function convert($param1, $param2 = null)
    {

        if (null == $param2) {
            $param2 = Phprojekt_ModelInformation_Default::ORDERING_DEFAULT;
        }
        return self::_convertModel($param1, $param2);
    }

    /**
     * Convert a model or a model information into a CSV file
     *
     * @param Phprojekt_Interface_Model|array $models The model to convert
     * @param int                             $order  A Phprojekt_ModelInformation_Default::ORDERING_*
     *                                                const that defines the ordering for the convert
     * @param boolean                         $exportHeader Determine if the header needs to be exported
     *
     * @return string
     */
    private static function _convertModel($models, 
                                          $order = Phprojekt_ModelInformation_Default::ORDERING_DEFAULT, 
                                          $exportHeader = true)
    {
        $datas = array();
        $data = array();
        
        if (null === $models) {
            return self::_writeFile(array('metadata' => array()));
        }

        if (!is_array($models) && $models instanceof Phprojekt_Model_Interface) {
            $model = $models;
        } else if (is_array($models) && !empty($models)) {
            $model = current((array) $models);
        } else {
            return self::_writeFile(array('metadata' => array()));
        }

        if (!$model instanceof Phprojekt_Model_Interface) {
            throw new InvalidArgumentException();
        }
        
        $information = $model->getInformation($order);
        
        // Csv file header
        if ($exportHeader) {
            $metadata = $information->getFieldDefinition($order);
            if (is_array($metadata)) {
                foreach ($metadata as $oneCol) {
                    $data[] = $oneCol['label'];
                }
            }
            
            $datas[] = $data;
        }

        
        foreach ($models as $cmodel) {
            
            $data   = array();
            
            foreach ($information->getFieldDefinition($order) as $field) {
                $key   = $field['key'];
                $value = $cmodel->$key;
                $data[] = $value;
                
            }
            $datas[] = $data;
        }
        
        return self::_writeFile($datas);
    }

    /**
     * Writes header and content of the CSV file based on data array
     *
     * @param array $data Data to write on file
     *
     * @return string
     */
    private static function _writeFile($data)
    {
        
        $outputString = "";
        
        if (is_array($data)) {
            foreach ($data as $rowNbr => $oneRow) {
                if ($rowNbr > 0) {
                    $outputString .= "\"\n";
                }
                foreach ($oneRow as $colNbr => $oneData) {
                    if ($colNbr > 0) {
                        $outputString .= '","';
                    } else {
                        $outputString .= '"';
                    }
                    $outputString .= str_replace('"', '""', $oneData);
                }
            }
            $outputString .= "\"\n";
        }
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        header('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
        header("Cache-Control: no-store, no-cache, must-revalidate");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        header('Content-Length: ' . strlen($outputString));
        header("Content-Disposition: attachment; filename=\"export.csv\"");
        header('Content-Type: text/csv');
        echo $outputString;
    }
}