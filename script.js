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

    //ADICIONA O CK EDITOR NOS ELEMENTOS COM CLASSE "ckeditor"
    modal.querySelectorAll('.ckeditor').forEach((elemento) => {
        CKEDITOR.replace(elemento.id);
    });

    installJqueryMask(modal.id);
}

const installJqueryMask = (modalId) => {
    const masks = {
        date: { pattern: '00/00/0000' },
        time: { pattern: '00:00:00' },
        date_time: { pattern: '00/00/0000 00:00:00' },
        cep: { pattern: '00000-000' },
        phone: { pattern: '0000-0000' },
        phone_with_ddd: { pattern: '(00) 0000-0000' },
        phone_us: { pattern: '(000) 000-0000' },
        mixed: { pattern: 'AAA 000-S0S' },
        cpf: { pattern: '000.000.000-00', config: { reverse: true } },
        cnpj: { pattern: '00.000.000/0000-00', config: { reverse: true } },
        money: { pattern: '000.000.000.000.000,00', config: { reverse: true } },
        money2: { pattern: '#.##0,00', config: { reverse: true } },
        ip_address: { pattern: '099.099.099.099' },
        percent: { pattern: '00/00/0000', config: { reverse: true } },
        'clear-if-not-match': { pattern: '00/00/0000', config: { clearIfNotMatch: true } },
        placeholder: { pattern: '00/00/0000', config: { placeholder: "__/__/____" } },
        fallback: {
            pattern: '00/00/0000', 
            config: {
                translation: {
                    'r': {
                        pattern: /[\/]/,
                        fallback: '/'
                    },
                    placeholder: "__/__/____"
                }
            }
        },
        selectonfocus: { pattern: '00/00/0000', config: { selectOnFocus: true } },
    }

    Object.keys(masks).forEach((maskKey) => {
        const mask = masks[maskKey];
        $(`#${modalId} .${maskKey}`).mask(mask.pattern, mask.config);
    });
}


abrirModal();
