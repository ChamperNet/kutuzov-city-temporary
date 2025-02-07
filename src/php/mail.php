<?php
header('Content-Type: application/json');
require_once "SendMailSmtpClass.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Метод не поддерживается"]);
    exit;
}

$project_name = trim(
    isset($_POST["project_name"]) ? $_POST["project_name"] : "Kutuzov City"
);
$admin_email  = trim(
    isset($_POST["admin_email"]) ? $_POST["admin_email"] : "info@champer.ru"
);
$form_subject = trim(
    isset($_POST["form_subject"]) ? $_POST["form_subject"] : "Форма с сайта"
);

$message = "";
$c = true;
foreach ($_POST as $key => $value) {
    if (!empty($value) && !in_array($key, ["project_name", "admin_email", "form_subject"])) {
        $message .= sprintf(
            '<tr style="background-color: %s;">
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>%s</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;">%s</td>
            </tr>',
            ($c = !$c) ? '#f8f8f8' : 'white',
            htmlspecialchars($key),
            htmlspecialchars($value)
        );
    }
}

$message = "<table style='width: 100%;'>$message</table>";

$from = ["Kutuzov City", "noreply@kutuzov-city.ru"];
$to = "info@champer.ru";

$mailSMTP = new SendMailSmtpClass();
$request = $mailSMTP->send($to, 'From website', $message, $from);

if ($request) {
    echo json_encode(["success" => true, "message" => "Форма успешно отправлена!"]);
} else {
    echo json_encode(["success" => false, "message" => "Ошибка отправки письма"]);
}
