
      function clip(){

        var url = '';
        var textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        url = 'window.document.location.href';
        textarea.value = url;
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("링크가 복사되었습니다. 필요하신 곳에 붙여넣기 하세요!")
        };

        function clip(){

            var url = '';
            var textarea = document.createElement("textarea");
            document.body.appendChild(textarea);
            url = 'https://bit.ly/3FlGrL9';
            textarea.value = url;
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("링크가 복사되었습니다. 필요하신 곳에 붙여넣기 하세요!")
            };
    