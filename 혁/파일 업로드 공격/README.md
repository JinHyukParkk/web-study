# 6. 파일 업로드 공격

## 6.1. 파일 업로드
 파일 업로드는 폼 데이터와 같은 방법으로 전송되는 것이 아닙니다. 그래서 인코팅 타입을 아래와 같이 multipart/form-data로 지정해야 합니다.
 ```
 <form action="upload.php" method="POST" enctype="multipart/form-data">
 ```
  폼 데이터와 파일을 전송하는 HTTP 요청은 특별한 포멧으로 구성되며, enctype은 브라우저에게 이 포맷을 알리기 위해 필요합니다. 사용자가 파일을 업로드하기 위한 폼 요소는 간단하게 되어 있습니다.
  ```
  <input type="file" name-"attachment">
  ```
 이 폼 요소를 렌더링하는 방법은 브라우저마다 다릅니다. 하지만 개발자 관점에서는 모두 동일한 동작입니다. 하나의 예제 폼을 보겠습니다.
 ```
 <form action="upload.php" method="POST" enctype="multipart/form-data">
    <p>Please choose a file to upload:
        <input type="hidden" name="MAX_FILE_SIZE" value="1024" />
        <input type="file" name"attachment" /><br />
        <input type="submit" value="Upload Attachment" />
    </p>
</form>
 ```
 숨겨진 폼 변수 MAX_FILE_SIZE는 브라우저가 허용할 수 있는 파일의 최대 크기를 바이트 단위로 표시한 것입니다. 하지만 클라이언트 단에서의 제한이기 때문에 공격자는 쉽게 제한을 제거할 수 있습니다. 그래서 서버 단에서도 제한을 따르도록 해야합니다.
** PHP 지시문 중에 upload_max_filesize는 업로드할 수 있는 최대 파일 크기를 정할 수 있고, post_max_size를 사용해도 업로드할 파일 크기를 제한하는데 이용할 수 있습니다.

파일을 업로드받는 upload.php 에서 슈퍼 전역변수 $_FILE의 내용을 표시했을 때(txt파일이라 가정)
```
Array
(
    [attachment] => Array
                    (
                        [name] => test.txt
                        [type] => text/plain
                        [tmp_name] => /tmp/phpShfltt
                        [error] => 0
                        [size] => 36
                    )
)
```
$_FILE에 어떤 것들이 알 수 있지만 정보의 출처가 어디인지 아는데는 도움이 안됩니다. 그래서 HTTP 요청이 어떻게 구성되는지 알 필요가 있습니다.
```
POST /upload.php HTTP /1.1
Host: test.org
Content-Type: multipart/form-data; boundary=----------12345
Content-Length: 245
```
----------12345
Content-Disposition: form-data; name="attachment";
filename="text.txt"
Content-Type: text/plain

Hello

----------12345
Content-Disposition: form-data; name="MAX_FILE_SIZE"

1024
----------12345--
```

위를 보면 데이터별로 boundary로 나뉘어서 전달되고, 메타 데이터를 식별해낼 수 있습니다. 슈퍼전역 변수 $_FILE만으로도 PHP 상에서 tmp_name, error, size를 알 수 있습니다.

하지만 업로드된 파일을 검증하지 않고 tmp_name을 사용한다면 이론상 위험이 존재합니다. 그래서 PHP에서는 이러한 위험을 덜어주기 위해 is_upload_file()과 move_uploaded_file()을 제공합니다. tmp_name이 참조하는 파일이 업로드된 파일인지 검사하고 싶다면 is_uploaded_file() 함수를 사용할 수 있습니다.
```
<?php
    $filename = $_FILES['attachment']['tmp_name'];
    if (is_uploaded_file($filename)) {
        /* 업로드된 파일이면 $_FILES['attachment']['tmp_name'] 로 접근 */
    }
?>
```
또한 업로드된 파일을 저장할 위치로 옮기려면 move_uploaded_file() 함수를 사용할 수 있습니다. 이 함수는 오직 업로드된 파일에 대해서만 사용합니다.
```
<?php
    $old_filename = $_FILES['attachment']['tmp_name'];
    $new_filename = '/path/to/attachment.txt';

    if (move_uploaded_file($old_filename, $new_filename)) {
        /* 업로드된 파일은 $old_filename이며, 파일 이동이 성공했습니다. */
    }
?>
```
마지막으로, 업로드된 파일의 크기를 확인하고 싶다면 filesize()를 사용하면 됩니다.
```
<?php
    $filename = $_FILES['attachment']['tmp_name'];
    if (is_uploaded_file($filename)) {
        $size = filesize($filename);
    }
?>
```

