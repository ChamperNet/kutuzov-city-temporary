<?php
header('Content-Type: application/json; charset=UTF-8');

require_once "SendMailSmtpClass.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Неверный метод запроса"], JSON_UNESCAPED_UNICODE);
    exit;
}


$project_name = trim(
    isset($_POST["project_name"]) ? $_POST["project_name"] : "Kutuzov City"
);
$admin_email  = trim(
    isset($_POST["admin_email"]) ? $_POST["admin_email"] : "info@champer.ru"
);
$form_subject = trim(
    isset($_POST["form_subject"]) ? $_POST["form_subject"] : "Обратная связь"
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
$to = "city@kutuzov-city.ru";
// $to = "info@champer.ru";

$mailSMTP = new SendMailSmtpClass('noreply@kutuzov-city.ru', 'bsyswwblqrgvgqlk', 'ssl://smtp.yandex.ru', 465, "UTF-8");

$request = $mailSMTP->send($to, 'From website', $message, $from);

if ($request) {
    echo json_encode(["success" => true, "message" => "Сообщение было успешно отправлено!"]);
} else {
    echo json_encode(["success" => false, "message" => "Возникла ошибка при отправке сообщения."]);
}
