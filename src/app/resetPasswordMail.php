<?php

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;

    case("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");
        // Payload is not send to $_POST Variable,
        // is send to php:input as a text
        $json = file_get_contents('php://input');
        //parse the Payload from text format to Object
        $params = json_decode($json);

        $email = $params->email;
        $name = $params->name;
        $message = $params->message;
        $base_url = "https://example.com/reset-password";
        $id = $params->id;
        $current_time = time(); 
        $expiration_time = $current_time + (24 * 60 * 60); 
        $recipient = $email; 
        $image_url = "" //auf dem Server der Anwendung oder in dist ordner der Anwendung nach build https://your-server.com/assets/images/dabubble-logo.png"
        $reset_link = $base_url . "?id=" . urlencode($id) . "&expires=" . urlencode($expiration_time);
        $subject = "Passwort Änderung";

        $message = "Hallo " . $name . "," . "<br><br>" .
        "Wir haben kürzlich eine Anfrage zum Zurücksetzen deines Passworts erhalten. Falls du diese
        Anfrage gestellt hast, klicke bitte auf den folgenden Link, um dein Passwort zurückzusetzen:" .
        "<br><br>" .
        "<a href='" . $reset_link . "'>Passwort zurücksetzen</a>" .
        "<br><br>" .
        "Bitte beachte, dass dieser Link aus Sicherheitsgründen nur 24 Stunden gültig ist." .
        "<br><br>" .
        " Falls du keine Anfrage zum Zurücksetzen deines Passworts gestellt hast, ignoriere bitte diese E-Mail." . 
        "<br><br><br>" . 
        "Beste Grüße," . 
        "<br><br>" .
        "Dein DABubble Team!";
        "<br><br>" .
        "<img src='" . $image_url . "' alt='DABubble Logo' width='255px' height='70'>"; // Bild hinzufügen

        $headers   = array();
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=utf-8';

        // Additional headers
        $headers[] = "From: noreply@dabubble.com";

        mail($recipient, $subject, $message, implode("\r\n", $headers));
        break;

    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
    } 
