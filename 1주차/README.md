# 1. PHP 특징
=============

## 1.1. 전역변수 등록
 보통 php에서 제공하는 register_globals 지시문을 사용하면 폼 데이터를 처리하는 복잡한 작업들을 대신 처리할 수 있고, 다양한 원격 소스로부터 전역변수들을 만들어 낼 수 있습니다. 하지만 편리한만큼 보안의 위협 즉, 보안 취약점의 가능성을 증가시키고, 데이터의 출처를 숨겨버리기 때문에 항상 데이터를 감시해야 하는 개발자의 책임과 상충합니다.  때문에 전역변수 등록을 사용하지 않고 응용프로그램을 개발, 배치해왔습니다. 마찬가지로 이 후 정리 내용엔 편의성이 조금 감소되지만 향상되는 보안을 감수하여 $_GET, $_POST와 같은 슈퍼 전역변수를 사용할 것입니다.

## 1.2. 오류 보고
 모든 개발자는 실수하기 마련이기에 PHP의 오류 보고 기능은 개발자의 실수를 식별하고 오류가 어느 부분에서 일어났는지 확인하는 데에 도움을 줍니다. 하지만 PHP가 제공하는 오류 보고에 대한 정보가 악의적인 공격자에게 표시되는 것을 바람직 하지 않습니다. 따라서 php.ini의 display_error를 Off 로 설정합니다. 오류에 대해 통보 받기를 원한다면 log.errors를 On 설정하고, 로그를 쌓을 위치 또한 설정이 가능합니다. 모든 오류 보고는 원하는 수준으로 수정할 수 있으며 호스트 공유 등의 서비스를 받는 경우이거나 php.ini이나 httpd.conf, .htaccess와 같은 파일을 변경할 수 없는 경우라면 php의 ini.set을 이용하여 설정이 가능합니다.
 ```
<?php
ini_set('error_reporting', E_ALL | E_STRICT);
ini_set('display_errors','Off');
ini_set('log_errors', 'On');
ini_set('error_log','/usr/local/apache/logs/error_log');

set_error_handler('my_error_handler');

function my_error_handler($number, $string, $file, $line, $context){
$error = "= == == == == \nPHP ERROR\n == == == == \n";
$error .= "Number: [$nubmer]\n";
$error .= "String: [$string]\n";
$error .= "File: [$file]\n";
$error .= "Line: [$line]\n";
$errir .= "Context:\n" . print_r($context, TRUE) . "\n\n";

error_log($error, 3, '/usr/local/apache/logs/error_log');
}
?>
 ```

 더 나아가 Error와 Exception을 구분하는 PHP의 경우 PHP7에서는 try catch 구문에서 Throwable 클래스에 예외뿐만 아니라 오류 클래스가 상속하여 구현되어 있어 예외, 오류 캐치가 가능합니다.
 ```
 <?php
try{

}catch(Exception $e){

}catch(Error $e){ //E_ERROR 와 E_RECOVERABLE_ERROR 의 경우
}

try{

}catch(Throwable $t){ // Exception 과 Error 를 합친 것

}
?>
 ```
 