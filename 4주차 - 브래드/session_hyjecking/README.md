# 1.SESSION
세션(session)은 컴퓨터 과학에서, 특히 네트워크 분야에서 반영구적이고 상호작용적인 정보 교환이며 둘 이상의 통신 장치나 컴퓨터와 사용자 간의 대화나 만남을 의미하는 다이얼로그(dialogue)이다.
# 2. SESSION FIXATION
이것은 공격자가 명시 적으로 사용자 세션의 세션 식별자를 설정하는 곳입니다. 일반적으로 PHP에서는 URL을 제공함으로써 완료됩니다 http://www.example.com/index...?session_name=sessionid. 공격자가 클라이언트에게 URL을 제공하면 공격은 세션 하이재킹 공격과 같습니다.

세션 고정을 방지하는 몇 가지 방법이 있습니다 (모두 수행).

설정 session.use_trans_sid = 0당신의 php.iDDDDDDDDDDDDDDDDDDDDDDD 이렇게하면 PHP가 URL에 식별자를 포함하지 않고 식별자의 URL을 읽지 않게됩니다.

설정 session.use_only_cookies = 1당신의 php.ini파일. 이렇게하면 PHP가 세션 식별자가있는 URL을 절대로 사용하지 않게됩니다.

세션의 상태가 변경 될 때마다 세션 ID를 다시 생성하십시오. 즉, 다음 중 하나를 의미합니다.

사용자 인증
세션에 중요한 정보 저장
세션에 대해 아무 것도 변경하기
기타...
# 3. SESSION Hijacking
세션 하이재킹은 시스템에 접근할 적법한 사용자 아이디와 패스워드를 모를 경우 공격 대상이 이미 시스템에 접속되어 세션이 연결되어 있는 상태를 가로채기 하는 공격으로 아이디와 패스워드를 몰라도 시스템에 접근하여 자원이나 데이터를 사용할 수 있는 공격이다.



# 3 방어방법
기본적으로 php에서는 htmlspecialchars가 있다.
```
<div><?php echo htmlspecialchars($name); ?>님의 말: </div>
```
htmlspecialchars는 특수문자를 html 앤터티로 변환하여 스크립트 등을 html 앤터티로 변환 시켜 일반 text로 출력하게 한다.

이렇게 할 경우에는 기본적인 문법을 지킨 스크립트 공격은 대부분 막게 된다.

하지만 이렇게 될 경우 특정 html 태그를 사용하지 못해, ui부분을 꾸밀 수 없기 때문에 몇몇 태그는 허용해주는 방법이 있다.

```
function html_filter($content)
{
 // Strip bad elements.
 $content = preg_replace('/(<)(|\/)(\!|\?|html|head|title|meta|body|style|link|base|script'.
 '|frameset|frame|noframes|iframe|applet|embed|object|param|noscript|noembed|map|area|basefont|xmp|plaintext|comment)/i',
 '&lt;$2$3', $content);

 // Strip script handlers.
 $content = preg_replace_callback("/([^a-z])(o)(n)/i",
 create_function('$matches', 'if($matches[2]=="o") $matches[2] = "&#111;";
 else $matches[2] = "&#79;"; return $matches[1].$matches[2].$matches[3];'), $content);

 return $content;
}
```
출저 wiki피디아(https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%ED%8A%B8_%EA%B0%84_%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8C%85)

해당 코드는 php로 구현한 간단한 html 필터 코드이다.

위 strip bad elements에 해당하는 코드는 해당 태그들을 삽입 못하도록 막은 것이다. 정규식을 이용해 태그 필터링을 해서 
다른 태그들은 사용할 수 있게끔 하였다.

# 4. 마치며
사실 xss를 막더라도 해커는 기여코 xss방법으로 우회하여 웹사이트 취약점을 발견해낸다. 하지만 이러한 기본적인 부분도 방어하지 않는다면, 더 많은 공격시도가 발생할 수 있기 때문에 최소한 안전장치를 다는 것이 좋다고 생각한다.
