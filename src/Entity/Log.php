<?php

namespace App\Entity;

use App\Entity\User\User;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity(repositoryClass="App\Repository\LogRepository")
 */
class Log
{
    /**
     * @var int
     *
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var \DateTime
     *
     * @ORM\Column(type="datetimetz")
     */
    private $time;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=128)
     */
    private $identifier;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\User\User")
     */
    private $user;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=128)
     */
    private $ip;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    private $message;

    public function __construct()
    {
        $this->time = new \DateTime();
        $this->ip = $_SERVER['REMOTE_ADDR'];
    }

    /**
     * @param string $identifier
     */
    public function setIdentifier(string $identifier): void
    {
        $this->identifier = $identifier;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    /**
     * @param string $message
     */
    public function setMessage(?string $message): void
    {
        $this->message = $message;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return \DateTime
     */
    public function getTime(): \DateTime
    {
        return $this->time;
    }

    /**
     * @return string
     */
    public function getIdentifier(): string
    {
        return $this->identifier;
    }

    /**
     * @return string
     */
    public function getIp(): string
    {
        return $this->ip;
    }

    /**
     * @return string
     */
    public function getMessage(): ?string
    {
        return $this->message;
    }
}
