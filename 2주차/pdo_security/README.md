# 1.  PDO 객체와 SQL 인젝션
=============

## 1.1. PDO 객체란 
PHP에서 사용되는 데이터베이스 extension(oci, mysql, postgresql, mssql 등)간의 일관성이 심각하게  결여된 상태에서 php database extension 관리 담당자 들이 모여 lightweight API 제공합니다. 기존 사용하던 여러 RDMBS 라이브러리들이 공통적으로 제공하는 기능을 통합하였고, 이러한 개념을 PHP DATA Objects(PDO)라 칭합니다.
```
# 기본 사용법
try{
    // MySQL PDO 객체 생성
    // mysql을 다른 DB로 변경하면 다른 DB도 사용 가능
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    // 에러 출력
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(Exception $e) {
    echo$e->getMessage();
}

에러 모드:
// 에러 출력하지 않음
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
// Warning만 출력
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
// 에러 출력
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
```
설정에 따라 Error와 Warning상태를 출력 할 수 있습니다. 

## 1.2. SQL 인젝션이란?
사전적인 의미로 응용 프로그램 보안 상의 허점을 의도적으로 이용해, 악의적인 SQL문을 실행되게 함으로써 데이터베이스를 비정상적으로 조작하는 코드 인젝션 공격 방법입니다.
예를 들어 아이디와 비밀번호를 확인하고 일치하면 로그인을 하는 PHP 프로그램이 있다고 가정할 때 
```
$username = $_POST["username"];
$password = $_POST["password"];
$mysqli->query("SELECT * FROM users WHERE username='{$username}' AND password='{$password}'");
```

위의 password에 아래과 같은 쿼리문을 넣게 되면 항상 참이 되기 때문에 공격자는 비밀번호를 입력하지 않고 로그인할 수 있게 됩니다.
 ```
 SELECT * FROM users WHERE username='admin' and password='password' OR 1=1 --'
 ```


## 1.3. PDO로 SQL 인젝션 방지.
보통 password 값을 md5로 암호화 하여 저장하거나 이스케이프 필터링-mysql_real_escape_string(), addSlashes() 를 사용하여 방지하지만 PDO 객체에서도 prepare와 placeholder를 사용하여 SQL 인젝션 방지가 가능합니다.

아래와 같은 query는 placeholder 없기에 SQL 인젝션의 위험이 있습니다.
```
$st = $pdo->("INSERT INTO table (col1, col2, col3) values ($val1, $val2, $val3)");
```

그래서 이를 방지하기 위해
```
case.1)
$st = $pdo->('INSERT INTO table (col1, col2, col3) values (?, ?, ?)');
$st->execute(['val1', 'val2', 'val2']);
  
case.2)
$st = $pdo->("INSERT INTO table (col1, col2, col3) value (:col1, :col2, :col3)");
$st->execute([':col1'=>'val1', ':col2'=>'val2', ':col3'=>'val3']);
```
위 처럼 이름이 없는 ?의 placeholder를 주거나 :col1 이라는 이름을 주어 execute 할 때 파라미터 값을 넘겨 줍니다.

다음은 mysql 데이터 삽입과 갱신에 관해 인젝션을 방지하기 위해 prepare를 사용합니다. query를 하지않고, prepare을 실행 시킨 후 bindParam을 통해 값을 대입하고 execute를 실행합니다.
```
  try {
       $hostname=’localhost’;
         $dbname=’mysqldb’;
         $username=’username’;
         $password=’password’;
        $db=new PDO(‘mysql:host=localhost;dbname=testdb;charset=utf8′,’username’,’password’); 
        $stmt=$db->prepare(“INSERT INTO test (name) VALUES (:col2)”); 
        $stmt->bindParam(‘:col2′,$data2);           // 첫번째열은 auto_increment 이므로 삽입할 필요가 없다.
        $data2=”Kelvin”;
        $stmt->execute();
        $db=null;  
    }
    catch(Exception $e) {
        echo $e->getMessage();
    }
?> 
```
다음은 데이터를 갱신하는 예제이다. col2는 문자열이지만 이전 mysql_query에서 사용되던 sql명령문과 달리 문자열을 ”로 감싸지 않아도 되고 변수를 연결해주기만 하면 되므로 injection이 불가능해진다. 

```
다음은 예제입니다.
<?php
    try {
        $hostname=’localhost’;
        $dbname=’mysqldb’;
        $username=’username’;$password=’password’;
        $db=new PDO(‘mysql:host=localhost;dbname=testdb;charset=utf8′,’username’,’password’);
        $stmt=$db->prepare(“UPDATE test SET name=:col2 WHERE id=:col1“); 
        $stmt->bindParam(‘:col1’,$data1);   
        $stmt->bindParam(‘:col2’,$data2);        
        $data1=5;
        $data2=”Robin”;
        $stmt->execute();
        $db=null;  
    }
catch(Exception $e) {
      echo $e->getMessage();
}
?> 
```
테이블에 접속하기 위해 PDO 객체를 생성하고 개수를 출력하고 접속을 닫는다.