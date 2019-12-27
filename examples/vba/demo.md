```
sub test()
    call notifyMeViaTG("Hello world!")
end sub

Sub notifyMeViaTG(ByVal msgText As String, Optional ByVal photoURL As String = "", Optional ByVal markdownMode As Boolean = False, Optional ByVal tgURL As String = "https://tgmsgbot.begabung.site/notifyME/sendMessage/:token")
    Dim fullPostData As String
    If Len(msgText) = 0 Then
        End
    Else
        fullPostData = "text=" & msgText
    End If
    If Len(photoURL) <> 0 Then
        If photoURL Like "*%2F*" Then
            fullPostData = fullPostData & "&photo=" & photoURL
        Else
            fullPostData = fullPostData & "&photo=" & GetURL(photoURL)
        End If
    End If
    If markdownMode Then fullPostData = fullPostData & "&parse_mode=Markdown"
    Call uploadDataPost(fullPostData, tgURL)
End Sub

Function uploadDataPost(ByVal data As String, ByVal url As String)
    Dim http As Object
    Set http = CreateObject("Microsoft.XMLHTTP")
    With http
        .Open "POST", url, False
        .setRequestHeader "CONTENT-TYPE", "application/x-www-form-urlencoded"
        .Send data  'data为JSON字符串
        uploadDataPost = .Status
    End With
End Function

Function GetURL$(txt$, Optional LC = &H804)
    Dim I As Long
    Dim a() As Byte: a = StrConv(txt, vbFromUnicode, LC)
    For I = 0 To UBound(a)
        GetURL = GetURL & "%" & Right("0" & Hex(a(I)), 2)
    Next
End Function
```

