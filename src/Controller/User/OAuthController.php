<?php

namespace App\Controller\User;

use App\Controller\AbstractController;
use App\Entity\OAuth\Client;
use App\Model\ApiResponse;
use App\Model\Permission;
use App\Service\AliyunOSS;
use App\Service\OAuthService;
use League\OAuth2\Server\Exception\OAuthServerException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bridge\PsrHttpMessage\Factory\DiactorosFactory;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class OAuthController extends AbstractController
{
    /**
     * @var \League\OAuth2\Server\AuthorizationServer
     */
    private $server;

    public function __construct(OAuthService $service)
    {
        $this->server = $service->getServer();
        parent::__construct();
    }


    /**
     * @Route("/oauth/authorize")
     */
    public function authorize(Request $request){
        return JsonResponse::create(null,404);
    }

    /**
     * @Route("/oauth/accessToken")
     */
    public function accessToken(Request $request){
        $factory = new DiactorosFactory();
        $httpFoundationFactory = new HttpFoundationFactory();
        $psrResponse = $factory->createResponse(new Response());
        $psrRequest = $factory->createRequest($request);
        try{
            return $httpFoundationFactory->createResponse($this->server->respondToAccessTokenRequest($psrRequest,$psrResponse));
        }catch (OAuthServerException $e){
            return $httpFoundationFactory->createResponse($e->generateHttpResponse($psrResponse));

        }
    }

    /**
     * @Route("oauth/version", methods="GET")
     */
    public function version(Request $request){
        $repo = $this->getDoctrine()->getManager()->getRepository(Client::class);
        $client = $repo->getClientById($request->query->get("client_id"));
        return $this->response->response($client->getVersion());
    }

    /**
     * @Route("oauth/uploadSts", methods="GET")
     */
    public function uploadSts(Request $request,AliyunOSS $oss){
        return $this->response->response($oss->getUploadToken($this->getUser()->getUsername()),200);
    }

    /**
     * @Route("oauth/uploadSignature", methods="GET")
     */
    public function uploadSignature(Request $request,AliyunOSS $oss){

        return $this->response->response($oss->getSignature());
    }

    /**
     * @Route("admin/basic/upload", methods="GET")
     */
    public function renderUploadPage(){
        $this->denA3accessUnlessGranted(Permission::IS_ADMIN);
        return $this->render("admin/basic/upload.html.twig");
    }

    /**
     * @Route("admin/basic/oauth", methods="GET")
     */
    public function renderOAuthPage(){
        $this->denyAccessUnlessGranted(Permission::IS_ADMIN);
        return $this->render("admin/basic/oauth.html.twig");
    }


    /**
     * @Route("admin/basic/oauth/edit")
     */
    public function getOAuthList(Request $request) {
        $this->denyAccessUnlessGranted(Permission::IS_ADMIN);
        $repo = $this->getDoctrine()->getManager()->getRepository(Client::class);
        if($request->request->has("client_id")){
            $client = $repo->getClientById($request->request->get("client_id"));
            $client->setVersion($request->request->get("version"));
            $em = $this->getDoctrine()->getManager();
            $em->persist($client);
            $em->flush();
            //return $this->response->responseEntity($client);
        }
        return $this->response->responseEntity($repo->findAll());
    }

}
