const abrirModal = () => {
    const openModalButtons = document.querySelectorAll("*[data-bs-toggle='modal']");
    openModalButtons.forEach((button) => {
        button.onclick = (e) => {
            e.preventDefault;
            const content = button.getAttribute("href");
            const modal = document.querySelector('#modal');

            const title = modal.querySelector('.modal-title').innerHTML = button.getAttribute("data-title-modal");
            fetch(content).then((response) =>
                response.text()
            ).then((html) => {
                modal.querySelector('.modal-body').innerHTML = html;

                setTimeout(() => {
                    installPlugins(modal);
                }, 100);
            

                formularioAjax();
            });
        };
    });
};


const formularioAjax = () => {

    $("#formularioAjax").submit(function (event) {
        event.preventDefault();

        var carregando = $(".ajaxLoading");

        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = ((evt.loaded / evt.total) * 100).toFixed(0);
                        $(".progress-bar").width(percentComplete + '%');
                        $(".progress-bar").html(percentComplete + '%');
                    }
                }, false);
                return xhr;
            },
            type: 'POST',
            url: $('#formularioAjax').attr("action"),
            data: new FormData(this),
            dataType: 'json',
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: function () {
                if ($('input[type="file"]').val()) {
                    $(".progress-bar").width('0%');
                    $(".progress").show();
                }
                carregando.show().fadeIn(200);

            },
            success: function (resposta) {
                console.log(resposta);
                //redirecionar
                if (resposta.redirecionar) {
                    $('#modal').hide().fadeOut(200);
                    window.location.href = resposta.redirecionar;
                }
                //recarrega
                if (resposta.recarregar) {
                    $('#modal').hide().fadeOut(200);
                    window.location.reload();
                } else {
                    carregando.fadeOut(200);
                }
                //mensagem
                if (resposta.mensagem) {
                    $("#ajaxResposta").html(resposta.mensagem);

                    new jBox('Notice', {
                        content: $(resposta.mensagem).removeClass('alert alert-warning'),
                        color: 'yellow',
                        showCountdown: true,
                        animation: 'pulse'
                    });

                }
            },
            complete: function () {
                carregando.hide().fadeOut(200);
            },
            error: function (xhr, resp, text) {
                console.log(xhr, resp, text);
            }
        });

    });
};

const installPlugins = (modal) => {

    //ADICIONA O EDITOR NOS ELEMENTOS COM CLASSE "ckeditor"
    modal.querySelectorAll('.ckeditor').forEach((elemento) => {
        CKEDITOR.replace(elemento.id);
    });

    installJqueryMask();
}

const installJqueryMask = () => {
    $('.date').mask('00/00/0000');
    $('.time').mask('00:00:00');
    $('.date_time').mask('00/00/0000 00:00:00');
    $('.cep').mask('00000-000');
    $('.phone').mask('0000-0000');
    $('.phone_with_ddd').mask('(00) 0000-0000');
    $('.phone_us').mask('(000) 000-0000');
    $('.mixed').mask('AAA 000-S0S');
    $('.cpf').mask('000.000.000-00', { reverse: true });
    $('.cnpj').mask('00.000.000/0000-00', { reverse: true });
    $('.money').mask('000.000.000.000.000,00', { reverse: true });
    $('.money2').mask("#.##0,00", { reverse: true });
    $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
        translation: {
            'Z': {
                pattern: /[0-9]/, optional: true
            }
        }
    });
    $('.ip_address').mask('099.099.099.099');
    $('.percent').mask('##0,00%', { reverse: true });
    $('.clear-if-not-match').mask("00/00/0000", { clearIfNotMatch: true });
    $('.placeholder').mask("00/00/0000", { placeholder: "__/__/____" });
    $('.fallback').mask("00r00r0000", {
        translation: {
            'r': {
                pattern: /[\/]/,
                fallback: '/'
            },
            placeholder: "__/__/____"
        }
    });
    $('.selectonfocus').mask("00/00/0000", { selectOnFocus: true });
}


abrirModal();
