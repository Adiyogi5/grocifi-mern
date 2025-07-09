<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

function send_email($to = '', $subject = '', $body = '', $attachment = '', $cc = '')
{
    // $Emailsettings = get_general_settings();

    $controller = &get_instance();

    $controller->load->helper('path');

    // Configure email library
    $config = array();

    ///$config['useragent']            = "CodeIgniter";

    ///$config['mailpath']             = "/usr/bin/sendmail"; // or "/usr/sbin/sendmail"

    $config['protocol'] = "smtp";

    $config['smtp_host'] = "sandbox.smtp.mailtrap.io";

    $config['smtp_port'] = "2525";

    $config['smtp_timeout'] = '30';

    $config['smtp_user'] = "sdfd";

    $config['smtp_pass'] = "xccc";

    $config['mailtype'] = 'html';

    $config['charset'] = 'utf-8';

    $config['newline'] = "\r\n";

    $config['smtp_crypto'] = "TLS";

    $config['wordwrap'] = true;

    $controller->load->library('email');

    $controller->email->initialize($config);

    $controller->email->from("email_from@gmail.com", "application_name");

    $controller->email->to($to);

    $controller->email->subject($subject);

    $controller->email->message($body);

    if ($cc != '') {
        $controller->email->cc($cc);
    }

    if ($attachment != '') {
        $controller->email->attach(base_url() . "upload/" . $attachment);
    }

    if ($controller->email->send()) {

        return "success";

    } else {
        return "error"; //echo $controller->email->print_debugger();
    }
}
