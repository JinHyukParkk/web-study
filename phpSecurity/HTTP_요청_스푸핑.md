# 13, HTTP 요청 스푸핑
 폼 스푸핑보다 복잡한 공격이 HTTP 요청 스푸핑 입니다. 이 공격은 공격자에게 완전한 권한과 융통성을 제공하며 사용자가 제공하는 데이터 없이도 완벽하게 신뢰할 수 있습니다.
 
 POST 방식으로 form 을 전송 했을 때 아래의 HTTP 요청이 있을 때를 가정합니다.
 ```
 POST /process.php HTTP/1.1
 Host: example.org
 User-Agent: Mozilla/5.0 (X11; U; Linux i686)
 Referer: http://example.org/form.php
 Content-Type: application/x-www-form-urlencoded
 Content-Length: 9

 color=red
 ```
 해당 HTTP 요청만 보면 Refereer를 검사하면 될 것이라고 생각하지만 공격자는 모든 HTTP 요청 데이터를 다룰 수 있습니다. 

 방법은 간단합니다. 텔넷을 이용하여 80번 포트로 웹 서버와 직접 통신하면 됩니다. 
```
$ telnet example.org 80
Trying 192.0.34.166...
Connected to example.org (192.0.34.166) .
Escape character is `^]`.
GET / HTTP/1.1
Host: example.org

HTTP/1.1 200 OK
Date : Sat,21 May 2005 12:34:56 GMT
Server: Apache/1.3.31 (Unix)
Accept-Ranges: bytes
Content-Length: 410
Connection: close
Content-Type: text/ html

.... <html>....
```

해당 요청을 PHP로 변경하면
```
<?php
    $http_response = '';
    $fp = fsockopen('example.org', 80);
    fputs($fp, "GET / HTTP/1.1\r\n");
    fputs($fp, "Host: example.org\r\n\r\n");

    while (!feof($fp)) {
        $http_response .= fgets($fp, 128);
    }
    fclose($fp);
    echo nl2br(htmlentities($http_response, ENT_QUOTES, 'UTF-8'));
?>
```

이는 충분히 HTTP에 이해도가 높은 공격자라면 쉽게 악용할 수 있습니다. 하지만 HTTP 요청 스푸핑은 폼 스푸핑과 마찬가지로 우려할만한 사항은 아닙니다. 해당 공격도 입력 필터링과 요청으로 들어오는 데이터를 신뢰성 검사만으로 충분히 방어가 가능합니다.