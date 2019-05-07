<%-- 
    Document   : TestCustomTag
    Created on : May 7, 2019, 1:37:41 PM
    Author     : 987031
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="mytag" uri="/WEB-INF/tlds/head" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <mytag:Head thecolor="red" words="This is my custom tag" />
    </body>
</html>
