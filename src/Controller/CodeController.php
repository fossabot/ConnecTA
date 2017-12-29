<?php

namespace App\Controller;

use App\Entity\Code;
use App\Entity\User;
use App\Model\ApiResponse;
use App\Service\AliyunSMS;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class CodeController extends Controller
{
    /**
     * @var AliyunSMS
     */
    private $smsService;

    /**
     * @var ApiResponse
     */

    private $api;

    /**
     * @var User
     */
    private $user;

    /**
     * @var integer
     */
    private $code;

    /**
     * @var string
     */
    private $string;

    /**
     * CodeController constructor.
     */
    public function __construct()
    {
        $this->smsService = new AliyunSMS();
        $this->api = new ApiResponse();

        $this->code = mt_rand(100000, 999999);
    }

    /**
     * @Route("/code/domestic/register", methods="POST", name="sendRegisterCode")
     */
    public function sendRegisterCode(Request $request){
        $phone = intval($request->request->get("phone"));
        $this->sendSMS($phone,"register",AliyunSMS::REGISTER);
        return $this->api->response(null,200);
    }

    /**
     * @Route("/code/domestic/reset", methods="POST", name="sendResetCode")
     */
    public function sendRecoverCode(Request $request){
        $phone = intval($request->request->get("phone"));
        $user = $this->getDoctrine()->getManager()->getRepository(User::class)->findByPhone($phone);
        if(is_null($user))
            return $this->api->response(null,400);
        $this->sendSMS($phone,"reset",AliyunSMS::RECOVER);
        return $this->api->response(null,200);
    }

    /**
     * @Route("/code/domestic/change", methods="GET", name="sendChangeCode")
     */
    public function sendResetCode(Request $request){
        $phone = $this->getUser()->getPhone();
        if(is_null($phone)){
            return $this->api->response(null,400);
        }
        $phone = intval($request->request->get("phone"));
        $this->sendSMS($phone,"change",AliyunSMS::RECOVER);
        return $this->api->response(null,200);
    }

    /**
     * @Route("/code/domestic/bind", methods="POST", name="sendBindCode")
     */
    public function sendBindCode(Request $request){
        $phone = $request->request->get("phone");
        if(is_null($phone)){
            return $this->api->response(null,400);
        }
        $this->sendSMS($phone,"bind",AliyunSMS::BIND);
        return $this->api->response(null,200);
    }

    /**
     * @Route("/code/domestic/unbind", methods="GET", name="sendUnBindCode")
     */
    public function sendUnBindCode(Request $request){
        $phone = $this->getUser()->getPhone();
        if(is_null($phone)){
            return $this->api->response(null,400);
        }
        $this->sendSMS($phone,"bind",AliyunSMS::UNBIND);
        return $this->api->response(null,200);
    }

    private function send($country,$phone,$action){
        $util = \libphonenumber\PhoneNumberUtil::getInstance();
        try {
            $phoneObject = $util->parse($phone,$country);
            if($phoneObject->getCountryCode() == 86){

            }else{
                //$client = N
            }
        }catch(\libphonenumber\NumberParseException $e){

        }
    }
    private function sendSMS($phone,$action){
        $type = "";
        $code = new Code();
        $code->setAction($action);
        $code->setCode((string)$this->code);
        $code->setDestination($phone);
        $code->setType("phone");
        $em = $this->getDoctrine()->getManager();
        $em->persist($code);
        $em->flush();
        $this->smsService->sendCode($phone,$this->code,$type);
    }
}
