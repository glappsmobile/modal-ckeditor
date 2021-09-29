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

                    modal.querySelectorAll('.ckeditor').forEach((elemento) => {
                        CKEDITOR.replace(elemento.id);
                    });
                    
                    formularioAjax();
                });
            };
        });

    };

    abrirModal();

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