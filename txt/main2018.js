//Объектная модель готова к использованию
$(document).ready(function(){
	
	// -?????
    $("body").on("change", ".js-zags-select", function(){
		
        var zagsInputVal = $(".js-zags-select option:selected").val();
				
        if(zagsInputVal == "Не выбрано"){
			
            $(".js-zags-input").val("");
			
        } 
		else{
			
            $(".js-zags-input").val(zagsInputVal);
			
        }
		
    });

    //автобновление списка заявок
    var auto_refresh = setInterval(function(){
		
		if (!!$('.autorefresh').val() && $('.autorefresh').val() == '1'){
			
				refresh(1);
				
		}		
		else if (!!$('.autorefresh').val() && $('.autorefresh').val() == '0'){
			
				fakerefresh(1);
			
			}
		},
		60000
		
    );

    //голосование
    $("body").on("click", ".qc_smile", function (){
		
        if (!$(this).attr("value")){
			
            return;
			
		}	

        var estimate = $(this).attr("value");
        var item_id = $(this).attr("item_id");

        $.ajax({
			
            url: "/include/ajax_qc_vote.php?item_id=" + item_id + "&estimate=" + estimate,
            success: function (html){}
			
        });

        $(this).parents("td").removeClass("danger").removeClass("warning").removeClass("success");
		
        if(estimate == 0){
			
            $(this).parents("td").addClass("success");
			
		}
		
        if(estimate == 1){
			
            $(this).parents("td").addClass("warning");
			
		}
		
        if (estimate == 2){
			
            $(this).parents("td").addClass("danger");
			
		}	

        $(this).parents("td").find(".active").removeClass("active");
        $(this).addClass("active");
        $(this).parents("td").find(".last_vote").html("Последняя оценка:<br/> сейчас");
		
        return false;
		
    });

    $('#QCFilter').on('shown.bs.modal', function (event){
		
        var button = $(event.relatedTarget);
        $(this).find('.qc_type').val(button.data('type'));
		
    });
	
	
	
	
	
	
	
	
	
	
	///////////////////////////////////////////// Экспорт в CSV /////////////////////////////////////////////
	
	//событие нажатие на кнопку "Экспорт в CSV"
    $('#createreport').on('shown.bs.modal', function (event){
		
		//добавляем в форму "ВЫГРУЗКА В CSV", путь куда будет отправлен результат формы
        var link = window.location.href.replace("#", "").replace("requests/", "include/ajax_createreport.php");
        $(".createreport_form").attr("action", link);
		
    });

    //Событие нажатие на кнопку "Выгрузить" формы "ВЫГРУЗКА В CSV"
    $("body").on("click", ".createreport_do", function (){
		
		//отправляю форму
        $(".createreport_form").submit();
        return false;
		
    });

    //Событие отправка формы "ВЫГРУЗКА В CSV"
    $('body').on('submit', '.createreport_form', function (e){

        var link = $(this).attr("action");
        var input = $(this).serializeArray();
		
		//отправляю результат формы на обработку, формировани отчета и отправку на почту
        $.ajax({
			
            url: link,
            type: "GET",
            data: input,
            cache: false,
            success: function (html){}
			
        });
		
        $('#createreport').modal('hide');
		
		// Добавлено Афанасьев 2016-12-02
        var email = $("input[name='createreport[email]']").val();
        var nStr = 'Отправлен запрос на формирование выгрузки. Ожидайте результат на адрес: ' + email;
        alert(nStr);
		//Окончание Афанасьев
		
        e.preventDefault();
        return false;
		
    });
	
	//выбор чекбокса "Только ФКУ"
    $('body').on("click", ".createreportcheck", function (){
		
        var value = $(this).prop("checked");
		
        $(".createreportcheck").prop("checked", false);
        $(this).prop("checked", value);
		
    });
	
	///////////////////////////////////////////// Экспорт в CSV /////////////////////////////////////////////

	
	
	
	
	
	
	
	
	
    //проверяем при загрузке страницы, нужно ли включить фильтр "Архив" или выводить весь список заявок
    getrequestscountbygroup();
	
	//Выводит список с включенным фильром "Архив" или же весь список заявок
    function getrequestscountbygroup(){
		
		//проверяем включен ли фильтр "Архив"				
        if ($('.archivebtn').prop('checked') == true){
			
            if (!$('.archivebg').hasClass('loadbg')){
				
                $('.statusblock').prepend('<div class="loadbg archivebg"><input type="hidden" value="1" name="filter[archive]"></div>');
				
            }
			
			$('.filter-description').hide(); // Подсчет отключен для облегчения работы с архивом. Парпалыгин И.А. 27.03.2019
        } 
		else{
			
            $('.archivebg').remove();
			$('.filter-description').show(); // Подсчет отключен для облегчения работы с архивом. Парпалыгин И.А. 27.03.2019
						
            $.ajax({
				
                url: "/include/ajax_getrequestscountbygroup.php",
                dataType: 'json',
                cache: false,
                success: function (res){
					
                    $.each(res, function (key, value) {
                        if (key == "navigation")
                            $('.navigation_block').html(value);
                        else
                            $('.filter-fast input[value="' + key + '"]').siblings("span").show().html(value).removeClass("notedited");
                    });
					
                    $('.filter-fast span.notedited').hide();
					
                }
				
            });
			
        }

    }









	
	///////////////////////////////////////////// МУЛЬТИЛАЙН /////////////////////////////////////////////

    //добавление поля в поле-мультилайне
    var addFormGroup = function(event){
		
        event.preventDefault();

        var $formGroup = $(this).closest('.form-group');
        var $multipleFormGroup = $formGroup.closest('.multiple-form-group');
        var $formGroupClone = $formGroup.clone();

        $(this)
                .toggleClass('btn-default btn-add btn-danger btn-remove')
                .html('–');

        $formGroupClone.find('input').val('');
        $formGroupClone.insertAfter($formGroup);

        var $lastFormGroupLast = $multipleFormGroup.find('.form-group:last');
        if ($multipleFormGroup.data('max') <= countFormGroup($multipleFormGroup)) {
            $lastFormGroupLast.find('.btn-add').attr('disabled', true);
        }
		
    };

    //удаление поля в поле-мультилайне
    var removeFormGroup = function (event){
		
        event.preventDefault();

        var $formGroup = $(this).closest('.form-group');
        var $multipleFormGroup = $formGroup.closest('.multiple-form-group');

        var $lastFormGroupLast = $multipleFormGroup.find('.form-group:last');
        if ($multipleFormGroup.data('max') >= countFormGroup($multipleFormGroup)) {
            $lastFormGroupLast.find('.btn-add').attr('disabled', false);
        }

        $formGroup.remove();
		
    };

    //мультилайн
    var countFormGroup = function ($form){
		
        return $form.find('.form-group').length;
		
    };
    $(document).on('click', '.btn-add', addFormGroup);
    $(document).on('click', '.btn-remove', removeFormGroup);
	
	///////////////////////////////////////////// МУЛЬТИЛАЙН /////////////////////////////////////////////
	
	
	
	
	
	
	
	
	
	
	///////////////////////////////////////////// ФИЛЬТР /////////////////////////////////////////////

    //автозаполнение пользователей в поле "Заявитель"
    $('.filter-users, #filter-users').typeahead({
		
        minLength: 2,
        delay: 200,
        autoSelect: false,
        source: function (query, process){
			
            return $.get('/include/ajax_myusers.php', {q: query}, function (data){
				
                return process(data);
				
            }, 'json');
			
        }
		
    });

		//14.07.21
	//автозаполнение пользователей в поле "Адрес ЭКП"
    $('#filter-ekp_address').typeahead({
		
        minLength: 2,
        delay: 200,
        autoSelect: false,
        source: function (query, process){
			
            return $.get('/include/ajax_ekp_address.php', {q: query}, function (data){
							
                return process(data);
				
            }, 'json');
			
        }
		
    });

    //автозаполнение пользователей в поле "Исполнитель"
    $('#filter-executors').typeahead({

        minLength: 2,
        delay: 200,
        autoSelect: false,
        source: function (query, process){
			
            return $.get('/include/ajax_myexecutors.php', {q: query}, function (data) {
                return process(data);
            }, 'json');
			
        }
		
    });

    //выбор этапа
    $('body').on("click", ".checkitem", function (){
		
        var selectall = true;
		
        $(this).parents(".form-group").find(".checkitem").each(function (){
			
            if ($(this).prop("checked") == false){
				
                selectall = false;
				
			}
			
        });
		
        $(this).parents(".form-group").find(".checkall").prop("checked", selectall);
		
    });
	
    //этап выбрать checkbox "Выбрать / убрать все"
    $('body').on("click", ".checkall", function (){
		
        if ($(this).is(":checked")){
			
            $(this).parents(".form-group").find(".checkitem").prop("checked", true);
			
        } 
		else{
			
            $(this).parents(".form-group").find(".checkitem").prop("checked", false);
			
        }
		
    });
	//14.07.21
	//маска для поля "Номер"
	$('#filter-nomer-year, #filter-nomer, #filter-ekp_code').numberMask({
		
        "type": "int"
		
    });
	
	//календарь в поле "Дата создания"
    $('.input-daterange').datepicker({
		
        todayBtn: "linked",
        language: "ru",
        format: "dd.mm.yyyy",
        todayHighlight: true
		
    });
	
	//событие нажатие на кнопку "Фильтровать"
    $("body").on("click", ".filter_go", function (){
		
        if(!$("#filter-fielduz").val() && !$("#filter-fieldinn").val()){
          $(".filter-danger").hide();
          $(".filter-form").submit();

          return false;
        }

        if(!$(".filter_hidden_field").val()){

            $(".filter-danger").show();

        } else {

            $(".filter-danger").hide();
            $(".filter-form").submit();

            return false;


        }


        // проверки изначально неправильно работали == "" не работает на undefined
        /* if ($("#filter-fielduz").val() == "" && $("#filter-fieldinn").val() == ""){

            $(".filter-danger").hide();
            $(".filter-form").submit();

            return false;

        } 
        else if (($("#filter-fielduz").val() != "" || $("#filter-fieldinn").val() != "") && $(".filter_hidden_field").val() == ""){

                $(".filter-danger").show();

            } 
        else{

            $(".filter-danger").hide();
            $(".filter-form").submit();

            return false;

        } */
		
    });
	
	//событие нажатия на кнопку "Отключить фильтры"
    $("body").on("click", ".filter_clear", function (){
        if (filterSelectedServices.length > 0) { // Поиск по услугам
          filterSelectedServices = []; // Поиск по услугам
        } // Поиск по услугам
		
        $('#filtertree').jstree('deselect_all', 'false');
        $('#filtertree').jstree('close_all'); // Поиск по услугам
        $('#filtertree').jstree('uncheck_all'); // Поиск по услугам
        $('.filter_hidden_field').val('');
        $('.filter-form').find("input[type=checkbox]").removeAttr('checked');
        $('.filter-form').find("input[type=checkbox]").removeAttr('checked');
        $('.filter-form').find("input[type=radio]").removeAttr('checked');
        $('.filter-form').find("option").removeAttr('selected');
        $('.filter-form').find("input[type=text]").val('');
        var today = new Date();
        var d = today.getFullYear();
        $('.filter-form').find("#filter-nomer-year").val(d);
        $(".filter-danger").hide();
        $(".filter-form").submit();
        filterExpandNodes = []; // Поиск по услугам
        nodeLoadQueue = []; // Поиск по услугам
        filterSelectedServices = []; // Поиск по услугам
    });
	
	//Отправка результатов формы "Фильтр". Применение фильтров.
    $('body').on('submit', '.filter-form', function (e){

        $(".reports-result-list-wrap").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");
        var input = $(this).serializeArray();

        $.ajax({
			
            url: "/requests/",
            type: "GET",
            data: input,
            cache: false,
            success: function (html){

                $(".list-wrap").html(html);
                if (!!$(".curpage").val()){
					
                    History.pushState(null, null, $(".curpage").val());
					
                }
				
                reselect_active();
                getrequestscountbygroup();
            }
			
        });
		
        $('#setFilter').modal('hide');
        e.preventDefault();
		
        return false;
		
    });
	
	// Смена количества заявок на странице (по 25,50,100 на странице)
    $('body').on('change', '.requestsperpage', function (e){
		
        $(this).parents("form").submit();
		
    });
	
	/*------------------------------------------------------------------------------- Быстрые фильтры -------------------------------------------------------------------------------*/

    //форма "Быстрые фильтры". Выбран один или несколько этапов. Из панели фильтры-этапы.
    $('body').on('change', '.filter-fast input', function (e){
		
        if ($(this).hasClass('statusbtn')){
			
            $('.archivebtn').prop("checked", false).removeAttr('checked').parents('label').removeClass('active');
			
        }

        $('.filter-form').find("input[value='" + $(this).val() + "']").prop("checked", $(this).prop("checked"));
        $(".filter-fast").submit();
		
    });
		
	//Событие отправка данных формы "Быстрые фильтры"
    $('body').on('submit', '.filter-fast', function (e){
		
        $(".reports-result-list-wrap").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");
        var input = $(this).serializeArray();
        var action = $(this).attr('action');

		// Парпалыгин И.А. 06.03.2020 Удаление фильтра по описанию при переходе в архив Начало
		if ($('.archivebtn').prop('checked') == true){
			action = action.replace(/\[description\]=.*&/,'[description]=&');
			$('#filter-description').val('');
		}
		// Парпалыгин И.А. 06.03.2020 Удаление фильтра по описанию при переходе в архив Конец
		
        $.ajax({
			
            url: action,
            type: "GET",
            data: input,
            cache: false,
            success: function (html){
				
                $(".list-wrap").html(html);
                if (!!$(".curpage").val()){
					
                    History.pushState(null, null, $(".curpage").val());
					
                }
				
                reselect_active();
                getrequestscountbygroup();
				
            }
			
        });
		
        $('.filter-fast label').addClass("disabled").find('input').attr('disabled', '');
        $('#setFilter').modal('hide');
		
        return false;
		
    });
	
	/*------------------------------------------------------------------------------- Быстрые фильтры -------------------------------------------------------------------------------*/
	
	///////////////////////////////////////////// ФИЛЬТР /////////////////////////////////////////////
	
	
	
	

	
	
	
	
	
    // открытие окна авторизации - ?????
    $('#myModal').modal({
		
        'show': true,
        'backdrop': 'static'
		
    });

    // табы при редактировании заявки - ?????
    $("body").on("click", ".go_tab", function (){
		
        if (!!$(this).attr('rel')){
			
            $($(this).attr('rel')).tab('show');
			
		}
		
        return false;
		
    });
	
	
	
	
	
	
	
	
	
	
	///////////////////////////////////////////// Действия с уже созданной заявкой /////////////////////////////////////////////
	
	//Событие нажатие на кнопку "Добавить файл" вкладка "Комментарии"
    $("body").on("click", ".go_attachments", function (){
		
		//перевод на вкладку "Прикрепления" и нажатии на кнопку "Выбрать файл..."
        $(".tab_attachments").tab('show');
        $('#fileupload').click();
		
        return false;
		
    });

	//Событие нажатие на кнопку "Решение"
    $("body").on("click", ".btn_solution", function (){
		
		//вставляем в форму "Решение" значения переменных
        var login = $('.attachment-form input[name=UF_USERLOGIN]').val();
        var bitrixid = $('.attachment-form input[name=bitrixid]').val();
        var extID = $('.attachment-form input[name=extID]').val();
        var UF_COMMENTKEY = $('.attachment-form input[name=UF_COMMENTKEY]').val();
        var UF_PASSAVAILABLE = $('.attachment-form input[name=UF_PASSAVAILABLE]').val();
        var disabled = $('.attachment-form input[name=disabled]').val();
        
        $("input[name='UF_USERLOGIN']").val(login);
        $("input[name='bitrixid']").val(bitrixid);
        $("input[name='extID']").val(extID);
        $("input[name='UF_COMMENTKEY']").val(UF_COMMENTKEY);
        $("input[name='UF_PASSAVAILABLE']").val(UF_PASSAVAILABLE);
        $("input[name='disabled']").val(disabled);
        $('#files_sol').empty();
        $('#progress_sol').empty();
        
    });
	
	//Событие нажатие на кнопку "Отправить" вкладка "Прикрепления"
    $('body').on('click', '.send_attachments', function (e){
		
        $("form.comment-form").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");
        var form = $(this).parents("form");
        var comment_text = $("textarea.comment-form").val();
        var subrequest_extid = $("input[name='subrequest_extid']").val();
        var input = form.serializeArray();
        input.push({name: "comment", value: comment_text});
        input.push({name: "subrequest_extid", value: subrequest_extid});

        $.ajax({
			
            url: "/include/send_attachments.php",
            data: input,
            cache: false,
            success: function (html){
				
                $(".load").remove();
                $(".loadbg").remove();

                $(".edit_request input[type!=hidden]").attr('disabled', '');
                $(".edit_request textarea").attr('disabled', '');
                $(".comment-form input[type!=hidden]").attr('disabled', '');
                $(".comment-form .btn").attr('disabled', '');
                $(".attachment-form .btn").attr('disabled', '');
                $(".comment-form textarea").attr('disabled', '');
                $(".attachment-form .btn").attr('disabled', '');

                $(".deleteloaded").remove();
				
            }
			
        });
		
        return false;
		
    });
	
	///////////////////////////////////////////// Действия с уже созданной заявкой /////////////////////////////////////////////

	
	
	
	
	
	
	
	
	
	
    // по идее тултип для фильтра - ?????			
    $('.withtooltip').tooltip();

    //выбор строки в списке заявок
    $("body").on("click", ".list-item", function () {
        $(".list-item").removeClass("active");
        $(this).addClass("active");
        remember_active();
        check_buttons();
    });

    //Событие нажатие на кнопку "Обновить список услуг"
    $('body').on('click', '.getservicesbusiness', function (){
		
        $.ajax({
            url: "/cron/getservicesbusiness.php",
            cache: false,
            success: function () {
                $('#getservicesbusiness').modal({
                    'show': true,
                    'backdrop': 'static'
                });
            },
        });
		
        return false;
		
    });
	
	//Событие нажатие на кнопку "Обновить только услуги"
    $('body').on('click', '.getservicesonly', function (){
		
        $.ajax({
			
            url: "/cron/getservicesonly.php",
            cache: false,
            success: function () {
                $('#getservicesonly').modal({
                    'show': true,
                    'backdrop': 'static'
                });
            }
			
        });
		
        return false;
		
    });

    //Событие нажатия на кнопку "Перевести на следующий этап"
    $('body').on('click', '.btn_approval', function (e){
				
		//если в наборе есть класс .disabled заканчиваем.
        if ($(this).hasClass('disabled')){
			
            return false;
			
		}	
				
		//получаем id обращения
        var id = $("tr.active").attr("rel");
		
		//делает кнопки "Перевести на следующий этап", "Отказать", "Отменить обращение", "Принять", "Не принять" - не доступными
        $(".btn_cancel").attr('disabled', '').addClass('disabled');
		url_str = '/include/approvalrequest.php?id=' + id;	
		
        $.ajax({
            url: url_str,
            cache: false,
            success: function (html){	
				
				$("#update_Request .modal-content").html(html);
				
				$("#update_Request").modal('show');
				
				//инициализация загрузки файлов
				init_fileuplod_update();
				
            }
			
        });
		
		//запрещает закрывать модальное окно при нажатии за его пределами
        $('#viewRequest').modal({
			
            'backdrop': 'static'
			
        });
		
    });
	
	//Закываю окно редактирования заявки - нажата икокна закрыть
	$('body').on('click', '#close_update_request', function (e){
		
		//отменяем блокировку кнопок
		$(".btn_cancel").removeAttr('disabled');
		$(".btn_cancel").removeClass('disabled');
		
	});
	
	//Закываю окно редактирования заявки - нажата кнопка "отмена"
	$('body').on('click', '#update_Request', function (e){
		
		//отменяем блокировку кнопок
		$(".btn_cancel").removeAttr('disabled');
		$(".btn_cancel").removeClass('disabled');
		
	});
	
	
	//Закываю окно редактирования заявки - нажата кнопка "отмена"
	$('body').on('click', '#submit_update_request_out', function (e){
		
		//отменяем блокировку кнопок
		$(".btn_cancel").removeAttr('disabled');
		$(".btn_cancel").removeClass('disabled');
		
	});
	
	//Отправляю на сохранение отредактированные данные обращения
	$('body').on('click', '#submit_update_request', function (e){
		
		//подготавливаем значения формы редактирования
		var input = $('.update_Request').serializeArray();
		var input_files = $('.attachment-form2').serializeArray();
		var input_res = input.concat(input_files); 
		
		$.ajax({
			url: "/requests/update_step2.php",
            data: input_res,
			type: "POST",
            cache: false,
            success: function (html){
				
				var html= JSON.parse(html);
				
				if(html.bool){
				
					//выводим результать редактирования обращения
					$("#update_Request .modal-content").html(html.html);
				
					setTimeout(
						function () {
							$('#update_Request').modal('hide');
							refresh();
						}
					, 2000);
					setTimeout(
						function () {
							$('#viewRequest').modal('hide');
						}
					, 1000);
					
				}
				else{
					
					//выводим результат редактирования обращения
					document.getElementById("request_update_error").innerHTML = html.html;
					
				}
								
                setTimeout(
                        function () {
                            $('#approvalRequest').modal('hide');
                            $('#viewRequest').modal('hide');
                            $(".approvalrequest input").removeAttr('disabled');
                            $(".approvalrequest textarea").removeAttr('disabled').val("");
                            $(".badappalert").hide();
                            refresh();
                        }
                , 500);
                $(".btn_cancel").attr('disabled', '').addClass('disabled');
                $(".cancelrequest input[type!=hidden]").attr('disabled', '');
                $(".cancelrequest textarea").attr('disabled', '');
                $(".comment-form input[type!=hidden]").attr('disabled', '');
                $(".comment-form .btn").attr('disabled', '');
                $(".comment-form textarea").attr('disabled', '');
                $(".attachment-form .btn").attr('disabled', '');
            }
        });
		
	});

    // Отмена заявки. Exec
    $('body').on('submit', '.approvalrequest', function (e){

        if ($(".appcomment").val().length < 5)
        {
            $(".badappalert").show();
            return false;
        }

        var id = $("tr.active").attr("rel");
        var input = $(this).serializeArray();
        $.ajax({
            url: "/include/approvalrequest.php?id=" + id + "&act=0",
            data: input,
            cache: false,
            success: function (html) {
                setTimeout(
                        function () {
                            $('#approvalRequest').modal('hide');
                            $('#viewRequest').modal('hide');
                            $(".approvalrequest input").removeAttr('disabled');
                            $(".approvalrequest textarea").removeAttr('disabled').val("");
                            $(".badappalert").hide();
                            refresh();
                        }
                , 500);
                $(".btn_cancel").attr('disabled', '').addClass('disabled');
                $(".cancelrequest input[type!=hidden]").attr('disabled', '');
                $(".cancelrequest textarea").attr('disabled', '');
                $(".comment-form input[type!=hidden]").attr('disabled', '');
                $(".comment-form .btn").attr('disabled', '');
                $(".comment-form textarea").attr('disabled', '');
                $(".attachment-form .btn").attr('disabled', '');
            }
        });
        return false;
    });

    // Открытие описания проблемы заявки 
    $('body').on('click', '.open-description', function (e) {
        $('#problemDescription').find('.modal-body').html($(this).parents(".form-group").find("textarea").val());
        $('#problemDescription').modal('show');
        return false;
    });

    // Закрытие заявки. Exec 
    $('body').on('click', '.btn_close', function (e) {
        $(".badestimatealert").hide();
        $(".estimate_group .btn-danger").removeClass('active');
        $(".estimate_group .btn-success").addClass('active');
        $(".estimate_group .estimate_good").prop('checked', true);
        $(".estimate_group").show();
        $(".closecomment").empty().show();
        var btn = $(this);
        if (!!$(this).attr("data-estimateavailable") && !!$(this).attr("data-commentavailable") && ($(this).attr("data-estimateavailable") == "1" || $(this).attr("data-commentavailable") == "1"))
            open_closerequest(btn);
        else
            $('.closeRequest').submit();

    });

    function open_closerequest(btn)
    {

        if (!!btn.attr("data-estimateavailable") && btn.attr("data-estimateavailable") == "0")
        {
            $(".estimate_group").hide();
        }
        $('#closeRequest').modal('show');

    }


    // Закрытие заявки. Exec 
    $('body').on('submit', '.closeRequest', function (e) {

        if ($(".estimate_bad").prop("checked") == true && $(".closecomment").val().length < 5)
        {
            $(".badestimatealert").show();
            return false;
        }

        var id = $("tr.active").attr("rel");
        $(".closeRequest").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");
        var input = $(this).serializeArray();
        $.ajax({
            url: "/include/closerequest.php?id=" + id,
            data: input,
            cache: false,
            success: function (html) {
                setTimeout(
                        function () {
                            $('#closeRequest').modal('hide');
                            $('#viewRequest').modal('hide');
                            $(".closeRequest input").removeAttr('disabled');
                            $(".closeRequest textarea").removeAttr('disabled').val("");
                            $(".badestimatealert").hide();
                            refresh();
                        }
                , 500);
                $(".load").remove();
                $(".loadbg").remove();
                $(".closeRequest input").attr('disabled', '');
                $(".closeRequest textarea").attr('disabled', '');
                $(".badestimatealert").hide();
            },
        });
        return false;
    });

    // Неприятие заявки. Exec 
    $('body').on('submit', '.returnRequest', function (e) {
        if ($(".returncomment").val().length < 5)
        {
            $(".badreturnealert").show();
            return false;
        }

        var id = $("tr.active").attr("rel");
        $(".returnRequest").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");
        var input = $(this).serializeArray();
        $.ajax({
            url: "/include/addcomment.php?id=" + id,
            data: input,
            cache: false,
            success: function (html) {
                setTimeout(
                        function () {
                            $('#returnRequest').modal('hide');
                            $('#viewRequest').modal('hide');
                            $(".returnRequest input").removeAttr('disabled');
                            $(".returnRequest textarea").removeAttr('disabled').val("");
                        }
                , 500);
                $(".load").remove();
                $(".loadbg").remove();
                $(".returnRequest input").attr('disabled', '');
                $(".returnRequest textarea").attr('disabled', '');
                $(".badreturnealert").hide();
            },
        });
        return false;
    });

    // Отмена заявки. Exec
    $('body').on('submit', '.cancelrequest', function (e) {

        if ($(".cancelcomment").val().length < 5)
        {
            $(".badcancelalert").show();
            return false;
        }
        var id = $("tr.active").attr("rel");
        $(".cancelrequest").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");
        var input = $(this).serializeArray();
        $.ajax({
            url: "/include/cancelrequest.php?id=" + id,
            data: input,
            cache: false,
            success: function (html) {
                setTimeout(
                        function () {
                            $('#cancelRequest').modal('hide');
                            $('#viewRequest').modal('hide');
                            $(".cancelrequest input").removeAttr('disabled');
                            $(".cancelrequest textarea").removeAttr('disabled').val("");
                            $(".badcancelalert").hide();
                            refresh();
                        }
                , 500);
                $(".load").remove();
                $(".loadbg").remove();
                $(".cancelrequest input[type!=hidden]").attr('disabled', '');
                $(".cancelrequest textarea").attr('disabled', '');
                $(".comment-form input[type!=hidden]").attr('disabled', '');
                $(".comment-form .btn").attr('disabled', '');
                $(".comment-form textarea").attr('disabled', '');
                $(".attachment-form .btn").attr('disabled', '');
            }
        });
        return false;
    });

	// Решение
    $('body').on('submit', '.solutionForm', function (e){

        if ($(".commentsolution").val().length < 5)
        {
            $(".badcancelalert").show();
            return false;
        }

        var id = $("input[name='bitrixid']").val();
        $(".solutionForm").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");
        var input = $(this).serializeArray();
        $.ajax({
            url: "/include/ajax_solution.php?id=" + id,
            data: input,
            cache: false,
            success: function (html) {
                setTimeout(
                        function () {
                            $('#solution').modal('hide');
                            $('#viewRequest').modal('hide');
                            $(".solutionForm input").removeAttr('disabled');
                            $(".solutionForm textarea").removeAttr('disabled').val("");
                            $(".badcancelalert").hide();
                            refresh();
                        }
                , 500);
                $(".load").remove();
                $(".loadbg").remove();
                $(".solutionForm input[type!=hidden]").attr('disabled', '');
                $(".cancelrequest textarea").attr('disabled', '');
                $(".comment-form input[type!=hidden]").attr('disabled', '');
                $(".comment-form .btn").attr('disabled', '');
                $(".comment-form textarea").attr('disabled', '');
                $(".attachment-form .btn").attr('disabled', '');
            }
        });
        return false;
    });

    // Оценка заявки. Exec
    $('body').on('submit', '.AddEstimate', function (e) {
        $(".AddEstimate").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");
        var input = $(this).serializeArray();
        var id = $("tr.active").attr("rel");
        $.ajax({
            url: "/include/AddEstimate.php?id=" + id,
            data: input,
            cache: false,
            success: function (html) {
                $(".load").remove();
                $(".loadbg").remove();
                $(".AddEstimate input[type!=hidden]").attr('disabled', '');
                $(".AddEstimate textarea").attr('disabled', '');
                $(".comment-form input[type!=hidden]").attr('disabled', '');
                $(".comment-form .btn").attr('disabled', '');
                $(".comment-form textarea").attr('disabled', '');
                $(".attachment-form .btn").attr('disabled', '');
            }
        });
        return false;
    });


    // во вкладке комментариев "ответить"
    $("body").on("click", ".comment-list button", function () {
        $(this).after($(".comment-answer"));

        // очищаем
        $(".comment-answer").show();
        $(".badcommentalert").hide();
        $("#comment_files").empty();
        $("input[name=UF_COMMENTKEY]").val($("input[name=UF_COMMENTKEY]").val() + "_other");
        $(".comment-answer input").removeAttr('disabled');
        $(".comment-answer .btn").removeAttr('disabled');
        $("textarea.comment-form").removeAttr('disabled').val('').focus();
        $(".subrequest_extid").val($(this).attr("rel"));
        $(this).remove();
        return false;
    });

    // Отправка комментария. Exec
    $('body').on('submit', '.comment-form', function (e) {
        //	return false;
        if ($("textarea.comment-form").val().length < 5 && $("#comment_files").html().length < 10)
        {
            $(".badcommentalert").show();
            return false;
        }
        $("form.comment-form").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");

        var input = $(this).serializeArray();
        $.ajax({
            url: "/include/addcomment.php",
            data: input,
            cache: false,
            success: function (html) {
                $(".load").remove();
                $(".loadbg").remove();

                $("form.comment-form input[type!=hidden]").attr('disabled', '');
                $(".badcommentalert").hide();
                $("form.comment-form .btn").attr('disabled', '');
                $("textarea.comment-form").attr('disabled', '');
                $(".edit_request input[type!=hidden]").attr('disabled', '');
                $(".edit_request textarea").attr('disabled', '');
                $(".attachment-form .btn").attr('disabled', '');

                $(".deleteloaded_comment").remove();

                if (!!$(".subrequest_extid").val() && $(".subrequest_extid").val().length > 0)
                {
                    $(".comment-list button[rel='" + $(".subrequest_extid").val() + "']").attr('disabled', '');
                }

                // 24.08.2020
                // 2020-ТУ00000000004846361
                setTimeout(function() {
                  $("#viewRequest").modal('hide');
                }, 1000);
            }
        });
        return false;
    });

    // Создание заявки. Загрузка первого шага
    $('#createRequest').on('show.bs.modal', function (e) {
        load_step(1);
        $('.withtooltip').tooltip();
    });

    // Валидация поля "Сумма задолж-ти НП, по которым возникла описанная проблема, руб." Парпалыгин-Шешукова 16.11.2016
    $('body').on('input', '.js_rub_validate', function (e) {
        var val = $(this).val();
        var count = val.length;
        var i = 0;

        if (val == '')
            return;

        for (var j = 0; j < val.length; j++) {
            if (val[0] == ',') {
                val = val.replace(',', '');
            }

            if (val[j] == ',') {
                count = j;
                break;
            }
        }
        val = val.substring(0, count + 3).replace(',,', ',').replace(/[^\d\,]+/g, '');
        $(this).val(val);
    });


    function Validation($str) {
        var summa = $str.val();
        var count = summa.length;
        var comma = 0; //наличие запятой ( 0 - нет запятой)
        var ost = '';
        var zir = 0;
        if (summa == '')
            return false;

        else {
            for (var j = 0; j < summa.length; j++) {
                if (summa[j] == ',') {
                    comma++;
                    count = j;
                }
            }

            var drobSum = -1;
            var mas = summa.split(',');
            var intSum = parseInt(mas[0]);//Числа до запятой

            if (mas.length > 1) {
                drobSum = mas[1];//Числа после запятой
                summa = intSum + ',' + drobSum;

                // Если ноль рублей вводить МОЖНО
                if (comma == 0 && summa != '') {
                    return summa + ',00';
                } else if (comma != 0 && summa[summa.length - 1] == ',') {
                    return summa + '00';
                } else if (comma != 0 && summa[summa.length - 2] == ',') {
                    return summa + '0';
                }
            } else {

                for (var j = 0; j < summa.length; j++) {
                    if (summa[j] != '0' || summa[j] != ',') {
                        zir++;
                    }
                }

                if (zir == 0) {
                    summa = 0;
                    return summa;
                } else {
                    summa = parseInt(summa);
                    comma = 0;

                    // Если ноль рублей вводить МОЖНО
                    if (comma == 0 && summa != '') {
                        return summa + ',00';
                    } else if (comma != 0 && summa[summa.length - 1] == ',') {
                        return summa + '00';
                    } else if (comma != 0 && summa[summa.length - 2] == ',') {
                        return summa + '0';
                    } else {
                        return '0,00';
                    }
                }

            }
            return summa;
        }
        // Конец МОЖНО
    }

    $('body').on('focusout', '.js_rub_validate', function (e) {
        var val = $(this).val();
        if (val == '')
            return;
        var rez = Validation($(this));
        $(this).val(rez);
    });

    $('body').on('submit', function (e) {
        var val = $(this).val();
        if (val == '')
            return;
        var rez = Validation($(this));
        $(this).val(rez);

    });

    $('body').on('keypress', '.js_rub_validate', function (e) {
        if (e.keyCode == 13) {
            var val = $(this).val();
            if (val == '')
                return;
            var rez = Validation($(this));
            $(this).val(rez);
        }
    });

    // КОНЕЦ Валидация поля "Сумма задолж-ти НП, по которым возникла описанная проблема, руб." Парпалыгин-Шешукова 16.11.2016


    // Создание заявки. Загрузка шага	
    function load_step(step)
    {
        $.ajax({
            url: "/requests/create.php?step=" + step,
            cache: false,
            success: function (html) {
                $("#createRequest .modal-content").html(html);
                init_sbtree();
                var w_h = $(window).height();
                $('#servicebusinesstree').css("max-height", (w_h - 500 < 120 ? 120 : w_h - 500) + 'px');
            },
        });
    }


    // Редактирование заявки. Обнуление модального окна
    $('#viewRequest').on('hide.bs.modal', function (e) {
        $("#viewRequest .modal-content").html($("#viewRequest .viewRequest_default").html());
    })


    // редактирование шага
    $("body").on("click", ".editstep", function () {
        var step = $(this).attr("step");
        var key = $(".create-form").find("input[name=key]").val();
        $.ajax({
            url: "/requests/create.php?edit=1&key=" + key + "&step=" + step,
            cache: false,
            success: function (html) {
                $("#createRequest .modal-content").html(html);
                init_sbtree();
                init_fieldstrees();
                checkAllEnablable();
                init_timepicker();
            },
        });
    });

    // неумещающийся текст в колонках списка заявок. Отображение при наведении курсора	
    $("body").on({
        mouseenter: function () {
            var th = this;
            if ($(this).find(".hiddable1").width() < ($(this).find(".hiddable2").width() + 10))
            {
                //$(this).find(".hiddable1").addClass("overflowed");
                $(th).find("span").prepend("<div class=\"popup pie\">" + $(th).find(".hiddable2").html() + "</div>");
                $(".popup").css("opacity", 0);
                setTimeout(
                        function () {
                            $(".popup").stop().animate({
                                opacity: 1.0
                            }, 200);
                        }
                , 200);
            }
        },
        mouseleave: function () {
            $(".popup").remove();
        }
    }, ".hiddable");

    // Кнопки сортировки
    $("body").on("click", ".sort", function () {

        var params = $(this).attr("href");

        $(".list-wrap").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");

        History.pushState(null, null, params);

        $.ajax({
            url: params,
            cache: false,
            success: function (html) {
                $(".list-wrap").html(html);
                reselect_active();
                getrequestscountbygroup();
            },
            complete: function () {
                $(".load").remove();
                $(".loadbg").remove();
            }
        });
        return false;
    });

    $("body").on(Modernizr.touch ? 'tap' : 'dblclick', ".list-item", function () { // или тап или дблклик  --------------------------------------------------!!!!!!!!!!!!!!!!!!!!!
        // Парпалыгин И.А. Костыль для доп. полей архива 19.07.2016
        if (document.location.href.indexOf("archive") > -1) {
            is_archive = 1
        } else {
            is_archive = 0
        }
        open_request($(this).attr("rel"), is_archive);
        // Конец костыля
    });

    $("body").on("keyup focus", "textarea.limited", function (event) {
        isNotMax(event);
    });

    // события клавы в списке заявок
    $("body").keydown(function (e) {
        // вверх
        if (e.keyCode == 38 && !$(".modal.fade:visible").is(":visible")) {
            if ($(".active").hasClass("list-item"))
                $("tr.active").removeClass("active").prev().addClass("active");
            else
                $(".list-item:last-child").addClass("active");
            check_position();
            check_buttons();
            remember_active();
            return false;
        }
        // вниз
        if (e.keyCode == 40 && !$(".modal.fade:visible").is(":visible")) {
            if ($(".active").hasClass("list-item"))
                $("tr.active").removeClass("active").next().addClass("active");
            else
                $(".list-item:first-child").addClass("active");
            check_position();
            check_buttons();
            remember_active();
            return false;
        }
        // интер
        if (e.keyCode == 13) {
            //consol.log(modal.fade:visible);
            if (!$(".modal.fade:visible").is(":visible")) //если нет открытых (видимых) модальных окон
                if ($(".active").hasClass("list-item")) { // если выбрана строка
                    // Парпалыгин И.А. Костыль для доп. полей архива 19.07.2016
                    if (document.location.href.indexOf("archive") > -1) {
                        is_archive = 1
                    } else {
                        is_archive = 0
                    }
                    // Конец костыля
                    open_request($(".list-item.active").attr("rel"), is_archive);
                }
        }
    });

    $("body").on("click", ".openfull", function () {
        $(".service-description-wrap-wrap").prepend("<div class='closefull'>свернуть</div>").removeClass("mh");
        $(".openfull").remove();
    });
    $("body").on("click", ".closefull", function () {
        $(".service-description-wrap-wrap").prepend("<div class='openfull'>читать далее</div>").addClass("mh");
        $(".closefull").remove();
    });

    $("body").on("change", ".fields", function () {
        //	alert(1);
        checkAllEnablable();
    });
    $("body").on("input", ".fields[type=text]", function () {
        checkAllEnablable();
    });

    //удаление файла из загрузки в комментариях
    $("body").on("click", ".deleteloaded_comment", function () {

        var params = $(this).attr("href");
        $(this).parents(".preview_wrap").remove();

        $.ajax({
            url: params,
            cache: false,
            success: function (html){}
        });
        return false;
    });

    //удаление файла из загрузки в аттачах
    $("body").on("click", ".deleteloaded", function () {

        var params = $(this).attr("href");
        $(this).parent("p").slideUp(200);

        $.ajax({
            url: params,
            cache: false,
            success: function (html){}
        });
        return false;
    });
	//удаление файла из загрузки в аттачах при редактировании заявки
    $("body").on("click", ".deleteloaded_update", function () {

        var params = $(this).attr("href");
		var test = $(this).parent("p");
		var test2 = test.parent("div");
		test2.slideUp(200);

        $.ajax({
            url: params,
            cache: false,
            success: function (html){}
        });
        return false;
    });

    // проверка доступности текущего поля
    function checkAllEnablable()
    {
        $(".fields").each(function () {
            checkEnablable($(this).attr('id'));
        });
    }

    // проверка доступности текущего поля
    function checkEnablable(fieldid)
    {
        var field1 = $("#" + fieldid); // субъект
        var enable1 = false; // сделать субъект видимым?
        var field2, comparing2, value2;

        //if((!!field1.attr("obligatory") && field1.attr("obligatory")=="1") || (!field1.attr("field2") || field1.attr("field2")=="" || !$("#" + field1.attr("field2")).attr("id") || !field1.attr("comparing2") || !field1.attr("value2")))
        if ((!field1.attr("field2") || field1.attr("field2") == "" || !$("#" + field1.attr("field2")).attr("id") || !field1.attr("comparing2") || !field1.attr("value2")))
        {
            enable1 = true // если нет условий сравнений или неправильно заданы - показываем
        } else
        {
            for (var indexCond = 2; ; indexCond++) {
                if (!field1.attr("field" + indexCond))
                    break;
                var field2 = $("#" + field1.attr("field" + indexCond)); // поле-объект
                var comparing2 = field1.attr("comparing" + indexCond); // условие доступности
                var value2 = field1.attr("value" + indexCond); // сравниваемое значение
                var field2_val = "";
                if (!(field2.attr("type") == "checkbox" && field2.prop("checked") == false))
                    // field2_val = field2.val();
					field2_val = (field2.val() == "" ? "Не выбрано" : field2.val());
                if (value2 == "0000000000000-0000-0000-000000000000" || value2 == "00000000-0000-0000-0000-000000000000")
                    value2 = "";
                switch (comparing2) {
                    case ">":
                        if (field2_val > value2)
                            enable1 = true;
                        break;
                    case ">=":
                        if (field2_val >= value2)
                            enable1 = true;
                        break;
                    case "<":
                        if (field2_val < value2)
                            enable1 = true;
                        break;
                    case "<=":
                        if (field2_val <= value2)
                            enable1 = true;
                        break;
                    case "=":
                        if (field2_val == value2)
                            enable1 = true;
                        break;
                    case "<>":
                        if (field2_val != value2 & field2_val != "Не выбрано")
                            enable1 = true;
                        break;
                    case "Содержит":
                        if (field2_val.indexOf(value2) >= 0)
                            enable1 = true;
                        break;
                    case "НеСодержит":
                        if (field2_val.indexOf(value2) < 0)
                            enable1 = true;
                        break;
                    default:
                        enable1 = true;
                        break;
                }
            }
        }

        if (enable1 == true)
            field1.parents(".form-group").show();
        else
        {
            field1.val('');
            field1.parents(".form-group").hide();
        }
    }

    // Открытие окна редактирования ---------------------------------------------------------------------------------------------------------------------------------------------!!!!!!!!!!!!!
    function open_request(id, isarchive)
    {
        // Парпалыгин И.А. Костыль для доп. полей архива 19.07.2016
        url_str = '/requests/detail.php?ROW_ID=' + id
        if (isarchive == 1) {
            url_str = url_str + '&isarchive'
        }

        // Конец костыля		
        $.ajax({
            url: url_str,
            cache: false,
            success: function (html) {
                $("#viewRequest .modal-content").html(html);
                $('.openedid').val(id);
				init_fileuplod2();
                init_fileuplod_for_comments();
                init_comment_buttons();
                init_fieldstrees();
                init_timepicker();
                init_fileupload_for_solution();
                checkAllEnablable();
            },
        });

        $('#viewRequest').modal({
            'backdrop': 'static'
        });
    }

    // Выбраннная строка списка заявок. Запоминает положение
    function remember_active()
    {
        if (!!$("tr.active").offset())
            $(".remembered_active").val($("tr.active").attr('rel'));
        else
            $(".remembered_active").val(0);
    }

    //выбраннная строка списка заявок. Выбор положения после автобновления списка
    function reselect_active(){
		
        if (($(".remembered_active").val() * 1) > 0 && !!$(".list-item[rel='" + $(".remembered_active").val() + "']").offset()){
			
            $(".list-item[rel='" + $(".remembered_active").val() + "']").addClass("active");
		
		}
		
    }

    // Выбраннная строка списка заявок. Следование окна браузера за выделенной строкой 
    function check_position()
    {
        if (!!$("tr.active").offset())
        {
            var w_p = $(window).scrollTop();
            var el_p = $("tr.active").offset().top;
            var w_h = $(window).height();

            // если курсор выше окна
            if (el_p - 100 < w_p)
                $(window).scrollTop(el_p - 100);
            // если курсор ниже окна
            if (el_p + 100 > w_p + w_h)
                $(window).scrollTop(el_p - w_h + 100);
        }
    }

    // неактуально
    function check_buttons()
    {
        if (!!$("tr.active").offset())
            $("a.btn_action").removeAttr('disabled');
        else
            $("a.btn_action").attr('disabled', '');
    }

    // Создание/Редактирование заявки. инициализация загрузки файлов
    function init_fileuplod(){
	
		//проверяем, какой адрес у нас - /include/fileuplod.php
        var url = window.location.hostname === 'blueimp.github.io' ? '//jquery-file-upload.appspot.com/' : '/include/fileupload.php';
		
		//при нажатии на кнопку "Выбрать файл..."
        $('#fileupload').fileupload({
            url: url,
            dataType: 'json',
            done: function (e, data){
                if (!!data.result){
				
                    var inner = '';
                    if (data.result.error == 1){
					
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Превышен максимальный размер файлов - 5Мб!</span></div><div class='clear'></div>";
                    
					} 
					else if (data.result.error == 4){
					
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Ошибка загрузки!</span></div><div class='clear'></div>";
                    } 
					else{
					
                        inner = '<a ' +
                                'href="' + data.result.path + '"' +
                                'class="previewloaded"' +
                                data.result.lightbox +
                                '>' +
                                '<img src="' + data.result.preview + '" />' +
                                '</a>' +
                                '<a ' +
                                'href="/include/ajax_deleteattachment.php?file=' + data.result.file_id + '"' +
                                'class="deleteloaded glyphicon glyphicon-minus"' +
                                'title="убрать"' +
                                '></a>' +
                                '<div class="descriptionloaded">' +
                                '<a ' +
                                'href="' + data.result.path + '"' +
                                'target="_blank"' +
                                '>' +
                                data.result.name +
                                '</a>' +
                                '<br>' +
                                '<span style="font-size:80%;color:#aaa;"> ' + data.result.description + ' </span>' +
                                '</div>' +
                                '<div class="clear"></div>';
								
                    }
                    ;
                    $('<p/>').html(inner).appendTo('#files');
                }
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                        'width',
                        progress + '%'
                        );
            }
        }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
    }

    // Создание/Редактирование заявки. инициализация загрузки файлов
    function init_fileuplod2()
    {
		//проверяем, какой адрес у нас - /include/fileupload2.php
        var url = window.location.hostname === 'blueimp.github.io' ?
                '//jquery-file-upload.appspot.com/' : '/include/fileupload2.php';
		
		//при нажатии на кнопку "Выбрать файл..."
        $('#fileupload').fileupload({
            url: url,
            dataType: 'json',
            done: function (e, data) {
                if (!!data.result)
                {
                    var inner = '';
                    if (data.result.error == 1)
                    {
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Превышен максимальный объем файлов - 5Мб!</span></div><div class='clear'></div>";
                    } else if (data.result.error == 2)
                    {
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Превышен максимальный объем файлов обращения - 15Мб!</span></div><div class='clear'></div>";
                    } else if (data.result.error == 4)
                    {
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Ошибка загрузки!</span></div><div class='clear'></div>";
                    } else
                    {
                        inner = '<a ' +
                                'href="' + data.result.path + '"' +
                                'class="previewloaded"' +
                                data.result.lightbox +
                                '>' +
                                '<img src="' + data.result.preview + '" />' +
                                '</a>' +
                                '<a ' +
                                'href="/include/ajax_deleteattachment.php?file=' + data.result.file_id + '"' +
                                'class="deleteloaded glyphicon glyphicon-minus"' +
                                'title="убрать"' +
                                '></a>' +
                                '<div class="descriptionloaded">' +
                                '<a ' +
                                'href="' + data.result.path + '"' +
                                'target="_blank"' +
                                '>' +
                                data.result.name +
                                '</a>' +
                                '<br>' +
                                '<span style="font-size:80%;color:#aaa;"> ' + data.result.description + ' </span>' +
                                '</div>' +
                                '<div class="clear"></div>';
                    }
                    ;
                    $('<p/>').html(inner).appendTo('#files');
                }
                $(".send_attachments").removeAttr('disabled');
            },
            progressall: function (e, data) {
                $(".send_attachments").attr('disabled', '');
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                        'width',
                        progress + '%'
                        );
            }
        }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
    }
	
	//Редактирование заявки. инициализация загрузки файлов
    function init_fileuplod_update(){
		
		//проверяем, какой адрес у нас - /include/fileuplod_update.php
        var url = window.location.hostname === 'blueimp.github.io' ? '//jquery-file-upload.appspot.com/' : '/include/fileuplod_update.php';
		
		//при нажатии на кнопку "Выбрать файл..."
        $('#fileupload_update').fileupload({
										
            url: url,
            dataType: 'json',
            done: function (e, data) {
                if (!!data.result){
				
                    var inner = '';
                    if (data.result.error == 1){
					
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Превышен максимальный объем файлов - 5Мб!</span></div><div class='clear'></div>";
                    
					} 
					else if (data.result.error == 2){
					
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Превышен максимальный объем файлов обращения - 15Мб!</span></div><div class='clear'></div>";
                    
					} 
					else if (data.result.error == 4){
					
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Ошибка загрузки!</span></div><div class='clear'></div>";
                    
					} 
					else{
					
                        inner = '<a ' +
                                'href="' + data.result.path + '"' +
                                'class="previewloaded"' +
                                data.result.lightbox +
                                '>' +
                                '<img src="' + data.result.preview + '" />' +
                                '</a>' +
                                '<a ' +
                                'href="/include/ajax_deleteattachment.php?file=' + data.result.file_id + '"' +
                                'class="deleteloaded glyphicon glyphicon-minus"' +
                                'title="убрать"' +
                                '></a>' +
                                '<div class="descriptionloaded"> <input type="hidden" name="id_bitrix_' + data.result.file_id + '" value =" ' + data.result.file_id + ' " />' +
                                '<a ' +
                                'href="' + data.result.path + '"' +
                                'target="_blank"' +
                                '>' +
                                data.result.name +
                                '</a>' +
                                '<br>' +
                                '<span style="font-size:80%;color:#aaa;"> ' + data.result.description + ' </span>' +
                                '</div>' +
                                '<div class="clear"></div>';
								
                    }
                    ;
                    $('<p/>').html(inner).appendTo('#files_update');
					
                }

            },
            progressall: function (e, data) {
					
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress_update .progress-bar').css(
                        'width',
                        progress + '%'
                        );
            }
        });
				
    }
	
    // Комментари. Инициализация загрузки файлов
    function init_fileuplod_for_comments()
    {

        var url = window.location.hostname === 'blueimp.github.io' ?
                '//jquery-file-upload.appspot.com/' : '/include/fileupload_for_comments.php';

        $('#comment_fileupload').fileupload({
            url: url,
            dataType: 'json',
            done: function (e, data) {

                if (!!data.result)
                {
                    var inner = '';
                    if (data.result.error == 1)
                    {
                        inner = '<div class="preview_wrap"><img src="/error.jpg" data-toggle="tooltip" class="previewerror" title="Превышен макс. объем" /></div>';
                    } else if (data.result.error == 2)
                    {
                        inner = '<div class="preview_wrap"><img src="/error.jpg" data-toggle="tooltip" class="previewerror" title="Превышен суммарный макс. объем" /></div>';
                    } else if (data.result.error == 3)
                    {
                        inner = '<div class="preview_wrap"><img src="/error.jpg" data-toggle="tooltip" class="previewerror" title="Только изображения" /></div>';
                    } else if (data.result.error == 4)
                    {
                        inner = '<div class="preview_wrap"><img src="/error.jpg" data-toggle="tooltip" class="previewerror" title="Ошибка загрузки" /></div>';
                    } else
                    {
                        inner = '<div class="preview_wrap"><a href="/include/ajax_deleteattachment.php?file=' + data.result.file + '" class="deleteloaded_comment glyphicon glyphicon-minus" title="убрать"></a><img src="' + data.result.html + '" class="previewloaded for_comment" /></div>';
                    }
                    ;

                    $('#comment_files').append(inner);
                    $('[data-toggle="tooltip"]').tooltip();
                }
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#comment_progress .progress-bar').css(
                        'width',
                        progress + '%'
                        );
            }
        }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
    }


	function init_fileupload_for_solution(){
		
        var url = window.location.hostname === 'blueimp.github.io' ?
                '//jquery-file-upload.appspot.com/' : '/include/fileuploadsol.php';

        $('#fileuploadsol').fileupload({
            url: url,
            dataType: 'json',
            done: function (e, data) {
                if (!!data.result)
                {
                    var inner = '';
                    if (data.result.error == 1)
                    {
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Превышен максимальный объем файлов - 5Мб!</span></div><div class='clear'></div>";
                    } else if (data.result.error == 2)
                    {
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Превышен максимальный объем файлов обращения - 15Мб!</span></div><div class='clear'></div>";
                    } else if (data.result.error == 4)
                    {
                        inner = "<a class='previewloaded'><img src='/error.jpg'></a><div class='descriptionloaded' style='color: red;'>" + data.result.name + "<br/><span style=' font-weight: bold;'> Ошибка загрузки!</span></div><div class='clear'></div>";
                    } else
                    {
                        inner = '<a ' +
                                'href="' + data.result.path + '"' +
                                'class="previewloaded"' +
                                data.result.lightbox +
                                '>' +
                                '<img src="' + data.result.preview + '" />' +
                                '</a>' +
                                '<a ' +
                                'href="/include/ajax_deleteattachment.php?file=' + data.result.file_id + '"' +
                                'class="deleteloaded glyphicon glyphicon-minus"' +
                                'title="убрать"' +
                                '></a>' +
                                '<div class="descriptionloaded">' +
                                '<a ' +
                                'href="' + data.result.path + '"' +
                                'target="_blank"' +
                                '>' +
                                data.result.name +
                                '</a>' +
                                '<br>' +
                                '<span style="font-size:80%;color:#aaa;"> ' + data.result.description + ' </span>' +
                                '</div>' +
                                '<div class="clear"></div>';
                    }
                    ;
                    $('<p/>').html(inner).appendTo('#files_sol');
                }
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress_sol .progress-bar').css(
                        'width',
                        progress + '%'
                        );
            }
        }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
				
    }

    // Создание заявки, вызывается на втором шаге, перебирает все выпадающие списки
    function init_timepicker(){
		
        $('.timepicker').timepicker({
            minuteStep: 10,
            secondStep: 10,
            defaultTime: false,
            showInputs: true,
            template: 'dropdown',
            showSeconds: true,
            showMeridian: false
        });

        $('.masked_int').numberMask({
			
            "type": "int"
			
        });
		
        $('.masked_dec').numberMask({
			
            "type": "decimal"
			
        });
		
        $('.masked_date').numberMask({
			
            pattern: /^[0-9\.]{0,10}$/
			
        });
		
        $('.masked_datetime').numberMask({
			
            pattern: /^[0-9 \.:]{0,19}$/
			
        });
		
    }

    // Создание заявки, вызывается на втором шаге, перебирает все выпадающие списки
    function init_fieldstrees(){
		
        $(".fieldtree").each(function (){
			
            init_fieldstree("#" + $(this).attr("id_ref"));
			
        });
		
    }

    // Созадние заявки. Инциализация дерева услуг
    function init_fieldstree(field_id){
		
        var jsondata = $(field_id + "_json").val();

        // поиск
        $(field_id + "_tree")
		
			.on('changed.jstree', function (e, data) {
				$(field_id).val(data.selected);
				checkAllEnablable();
			})
			
			.jstree({
				'core': {
					'data': $.parseJSON(jsondata),
					"multiple": false,
					"check_callback": true
				},
				
				'types': {
					"folder": {
						"icon": "glyphicon glyphicon-folder-open"
					},
					"default": {
						"icon": "glyphicon glyphicon glyphicon-file"
					},
				},
				
				"plugins": ["types", "sort"]
				
			});

    }


    // Поиск по услугам {
    
    var filterExpandNodes = [];
    var nodeLoadQueue = [];
    var filterSelectedServices = [];

    function loadExpandNodes() {
      if (nodeLoadQueue.length == 0) {
        $(filterSelectedServices).each(function(k, v) {
          $("#filtertree").jstree('select_node', v);
        });
        //console.log("selecting", filterSelectedServices);
        return;
      };

      var n = nodeLoadQueue.shift(); // .shift() // 24.07.2020
      var node = $("#filtertree").jstree("get_node", n);

      if (node) {
        //console.log("expanding node:", $("#filtertree").jstree("get_node", n));
        $("#filtertree").jstree("open_node", n, loadExpandNodes);
      } else {
        loadExpandNodes();
      }
    }

    // } Поиск по услугам


    if (!!$(".initfilter").val()){
		
        init_filtertree();
		
    }

    // Фильтр. Инциализация дерева услуг
    function init_filtertree(){
		
        $('#filtertree')
		
      // Поиск по услугам ЗАКОММЕНТИРОВАТЬ БЛОК {
			.on('changed.jstree', function (e, data) {
				$(".filter_hidden_field").val(data.selected);
			})
      // } Поиск по услугам

      // Поиск по услугам {
      .on('refresh.jstree', function(e) {
        if (filterSelectedServices.length > 0) {
          $(filterSelectedServices).each(function(k, v) {
            $("#filtertree").jstree('select_node', v);
          });
        }

        var tmpQueue = filterExpandNodes.slice();

        tmpQueue.sort(function(a, b) {
          return a.length > b.length;
        });

        tmpQueue.forEach(function(v, k) {
          v.forEach(function(j, i) {
            if (nodeLoadQueue.indexOf(j) === -1) {
              nodeLoadQueue.push(j);
            };
          });
        });

        loadExpandNodes();
      })

      .on('select_node.jstree', function(e, node) {
        var id = node.node.id;
        if (filterSelectedServices.indexOf(id) === -1) {
          filterSelectedServices.push(id);

          $(".filter_hidden_field").val(filterSelectedServices);

          var parents = /*node.node.parents || */node.node.li_attr.parents;
          if (parents && parents.length > 0) {
            //if (parents.length == 1 && parents[0] == "#") {
              parents = node.node.li_attr.parents.reverse();
            //};

            filterExpandNodes.push(parents);
          }
        }
      })

      .on('deselect_node.jstree', function(e, node) {
        var idx = filterSelectedServices.indexOf(node.node.id);
        if (idx !== -1) {
          filterSelectedServices.splice(idx, 1);
          $(".filter_hidden_field").val(filterSelectedServices);
        }
      })

      // } Поиск по услугам

			.jstree({
				'core': {
					'data': {
						//"url" : "//www.jstree.com/fiddle/?lazy",
						"url": "/include/ajax_servicebusinesstreefilter.php?id=#",
						"data": function (node) {
							return {"id": node.id};
						},
					},
					"multiple": true
				},
				
				'types': {
					"folder": {
						"icon": "glyphicon glyphicon-folder-open"
					},
					"default": {
						"icon": "glyphicon glyphicon glyphicon-file"
					},
				},
				
				"plugins": ["types", "wholerow", "checkbox", "sort"]
				
			});
			
    }

    if (!!$(".initcreatereport").val()){
		
        init_createreporttree();
		
    }

    // Фильтр. Инциализация дерева услуг
    function init_createreporttree(){
		
        $('#createreporttree')
		
			.on('changed.jstree', function (e, data){
				
				$(".filter_hidden_field").val(data.selected);
				
			})
			
			.jstree({
				
				'core': {
					'data': {
						"url": "/include/ajax_servicebusinesstreefilter.php?id=#",
						"data": function (node) {
							return {"id": node.id};
						},
					},
					"multiple": true
				},
				
				'types': {
					"folder": {
						"icon": "glyphicon glyphicon-folder-open"
					},
					"default": {
						"icon": "glyphicon glyphicon glyphicon-file"
					},
				},
				
				"plugins": ["types", "wholerow", "checkbox", "sort"]
				
			});
				
    }

    // Созадние заявки. Инциализация дерева услуг
    function init_sbtree(){
		
        $('#servicebusinesstree')
		
			//событие выбрана услуга, sb_hidden_field добавляем id услуги и sb_hidden_field_news_cheme тип услуги (с автозаполнением или без), срабатывает при возвращении на шаг назад
			.on('changed.jstree', function (e, data){
				
				$(".sb_hidden_field").val(data.selected);
				
				if ($("#" + data.selected[0]).attr("newscheme") == "1"){
						 
					$("#create_descr_div").hide();
					$(".sb_hidden_field_news_cheme").val(1);
						 
				}
				else{
						
					$(".sb_hidden_field_news_cheme").val(0);
					$("#create_descr_div").show();
						
				}
				
			})
			
			//выбранная услуга
			.on('select_node.jstree', function (e, data){
				
				if (data.node.type == "folder"){
					
					var cur = data.selected;
					$('#servicebusinesstree').jstree('open_node', cur);
					$('#servicebusinesstree').jstree('deselect_node', cur);
					
				} 
				else{	
				
					if (!!$("#" + data.selected[0]).attr("hasdescription")){
						
						getservicedescription(data.selected[0]);
						
					} 
					else{
						
						$(".service-description-wrap").parents(".form-group").hide();
						
					}

					if (!!$("#" + data.selected[0]).attr("priorityavailable") && $("#" + data.selected[0]).attr("priorityavailable") == "0"){
						
						$(".form-group-priority").hide();
						
					} 
					else{
						
						$(".form-group-priority").show();
						
					}
					
					if ($("#" + data.selected[0]).attr("newscheme") == "1"){
						 
						$("#create_descr_div").hide();
						$(".sb_hidden_field_news_cheme").val(1);
						 
					}
					else{
						
						$(".sb_hidden_field_news_cheme").val(0);
						
					}
					
				}
				
			})
			
			//вставляем в блок дерево услуг
			.jstree({
				
				'core': {
					'data': {
						"url": "/include/ajax_servicebusinesstree.php?id=#",
						"data": function (node){
							return {"id": node.id};
						},
					},
					"multiple": false
				},

				'types': {
					"folder": {
						"icon": "glyphicon glyphicon-folder-open"
					},
					"default": {
						"icon": "glyphicon glyphicon glyphicon-file"
					},
				},
				
				"plugins": ["types", "sort"]
				
			});
			
    }

    function readmore(){

        $(".closefull").remove();
		
        if ($(".service-description-wrap").height() > 70){
			
            $(".service-description-wrap-wrap").prepend("<div class='openfull'>читать далее</div>");
			
        } 
		else{
			
            $(".openfull").remove();
			
        }
		
    }

    // Получение описания услуги
    function getservicedescription(extid){
		
        $.ajax({
            url: "/include/ajax_getservicedescription.php?extid=" + extid,
            success: function (html) {
                if (html.length > 1)
                {
                    if (!$(".service-description-wrap-wrap").hasClass("mh"))
                        $(".service-description-wrap-wrap").addClass("mh");
                    $(".service-description-wrap").html(html).parents(".form-group").show();
                    readmore();
                } else
                    $(".service-description-wrap").parents(".form-group").hide();
            }
        });
		
    }

    // дизейблим кнопки, если комментарии недоступны
    function init_comment_buttons()
    {
        //if($(".comment-form input[name=disabled]").val()!="")
        //	$(".comment-list button").attr('disabled','');	
    }

    // Обновление списка заявок. Если Сайлент==тру - без лоадбара
    function refresh(silent)
    {

        if (!!$(".list-wrap").hasClass("list-wrap"))
        {
            if (!silent)
                $(".reports-result-list-wrap").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");

            var url = window.location.href.replace("#", "");

            if (!!$('.notchlink').val() && !!$('.notchtime').val() && $('.notchlink').val() != 0)
            {
                var notchlink = $('.notchlink').val();
                var notchtime = $('.notchtime').val();

                $.ajax({
                    url: notchlink,
                    cache: false,
                    dataType: 'json',
                    success: function (data) {

                        if (data.time > notchtime) // если зарубка новая, обновляем
                        {
                            $('.notchtime').val(data.time);

                            $.ajax({
                                url: url,
                                cache: false,
                                success: function (html) {
                                    $(".list-wrap").html(html);
                                    reselect_active();
                                },
                            });
                        } else // иначе ничего, просто удаляем лоадбар
                        {
                            $(".loadbg").remove();
                            $(".load").remove();
                        }
                        getrequestscountbygroup();
                    },
                    error: function () { // если зарубки нет
                        $.ajax({
                            url: url,
                            cache: false,
                            success: function (html) {
                                $(".list-wrap").html(html);
                                reselect_active();
                                getrequestscountbygroup();
                            },
                        });
                    },
                });
            } else // если ссылки на зарубку нет или это не заявитель - обновляем
            {
                $.ajax({
                    url: url,
                    cache: false,
                    success: function (html) {
                        $(".list-wrap").html(html);
                        reselect_active();
                        getrequestscountbygroup();
                    },
                });
            }

        }
    }
    // фейк-обновление, для сохранения сессии
    function fakerefresh(silent)
    {
        $.ajax({
            url: '/fakerefresh.php',
            cache: false,
            success: function () {}
        });
    }


    // Создание заявки. Обнуление модального окна
    $('body').on('submit', '#createRequest .create-form', function (e) {		
        var input = $(this).serializeArray();
        var action = $(this).attr('action');
        $("#createRequest form").prepend("<div class=\"load\"></div><div class=\"loadbg\"></div>");

        $.ajax({
            url: action,
            type: "POST",
            data: input,
            cache: false,
            success: function (html) {
                $("#createRequest .modal-content").html(html);
                init_sbtree();
                init_fieldstrees();
                checkAllEnablable();
                if (!!$(".createRequest_autoclose").val() && $(".createRequest_autoclose").val() == 1)
                {
                    setTimeout(
                            function () {
                                $('#createRequest').modal('hide');
                                refresh()
                            }
                    , 2000);
                }
            },
            complete: function () {
                $(".load").remove();
                $(".loadbg").remove();
                init_fileuplod();
                init_fieldstrees();
                init_timepicker();
            }
        });
        return false;
    })

    // maxlength для textarea
    function isNotMax(e) {

        var target = e.target || e.srcElement;

        if (!target.getAttribute('maxlength') || target.getAttribute('maxlength') == null || target.getAttribute('maxlength') * 1 < 1)
            return;

        var limit = target.getAttribute('maxlength') - 1;
                    var chars = target.value.length;

                    if (chars > limit) {
            target.value = target.value.substr(0, limit);
                    }
    }
	

    $('.modal').on('hidden.bs.modal', function (event) {
        if (!$(".modal:visible").css("display"))
            $("body").removeClass("modal-open");
        else
            $("body").addClass("modal-open");
    });

    // Поиск по услугам
    subscribeSearch("filtertree", "/include/ajax_servicebusinesstreefilter.php?id=#", 1);

    // Теги бизнес услуг
    // Теги бизнес услуг
  $("#serviceTags").on("shown.bs.modal", function(e) {
    $("#servicetags_services").jstree({
          'core': {
            'data': {
              //"url" : "//www.jstree.com/fiddle/?lazy",
              "url": "/include/ajax_servicebusinesstreefilter.php?id=#",
              "data": function (node) {
                return {"id": node.id};
              },
            },
            "multiple": false
          },

          "plugins": ["wholerow"]
          
        })

      .on("select_node.jstree", function(e, data) {
        $("#servicetags_tags").empty();

        var selectedIds = data.selected;
        var node = $("#" + selectedIds[0]);

        $.ajax({
          url: "/include/ajax_getservicetags.php?op=list&id=" + node.attr("id"),
          cache: false,
          success: function (d) {
            console.log(d);

            var tags = d.tags;

            tags.forEach(function(v, k) {
              $("#servicetags_tags").append("<a id='st_"+ v.id +"' href='#' class='list-group-item list-group-item-action servicetag-item' style='padding:4px'>" + v.tag + "</a>");
            });

            $(".servicetag-item").on('click', function() {
              var $th = $(this);
              $('.servicetag-item.active').removeClass('active');
              $th.toggleClass('active');
            });
          },
        });
      });
  });

  $("#st_add").on("click", function(e) {
    var selectedService = $("#servicetags_services").jstree("get_selected", true);

    $.post("/include/ajax_getservicetags.php?op=add", {
      service_id: selectedService[0].id,
      tag: $("#st_tag").val(),
    }, function(data) {
      $("#servicetags_services").trigger("select_node", [{selected: [selectedService[0].id]}]);
    });
  });

  $("#st_remove").on("click", function(e) {
    var selectedService = $("#servicetags_services").jstree("get_selected", true);

    $.post("/include/ajax_getservicetags.php?op=remove", {
      service_id: selectedService[0].id,
      tag: $(".servicetag-item.active").text(),
    }, function(data) {
      $("#servicetags_services").trigger("select_node", [{selected: [selectedService[0].id]}]);
    });
  });

}); ///////////////////////////////////////////////////////////////////////////////////////

// Поиск по услугам
function subscribeSearch(id, defurl, isFilter) {
  id = id || "servicebusinesstree";
  defurl = defurl || "/include/ajax_servicebusinesstree.php?id=";
  isFilter = isFilter || 0;

  var s_to = false;

  var $bustree = $("#" + id);
  var $searchpan = $("#service_search_" + id);

  $searchpan.keyup(function(e) {
    if (e.keyCode == 13) { e.preventDefault(); return; }
    if (s_to) { clearTimeout(s_to); }

    if ($searchpan.val().trim().length == 0) {
      //$bustree.jstree(true).clear_search();
      $bustree.jstree(true).settings.core.data.url = defurl;
      $bustree.jstree(true).refresh();

      return;
    };

    s_to = setTimeout(function() {
      var v = $searchpan.val();

      //$("#servicebusinesstree").jstree('search', v, false, true, '#');
      $bustree.jstree(true).settings.core.data.url = "/include/ajax_servicebusinesstreesearch.php?str=" + encodeURI(v) + "&filter=" + isFilter;
      $bustree.jstree(true).refresh();
      $bustree.jstree(true).settings.core.data.url = "/include/ajax_servicebusinesstree.php?id="; // ))0
    }, 500);
  });

  $("#clear_service_search_" + id).click(function(e) {
    if ($searchpan.val().length == 0) { return; }

    $searchpan.val("");
    //$bustree.jstree(true).clear_search();
    $bustree.jstree(true).settings.core.data.url = defurl;
    $bustree.jstree(true).refresh();
  });
};

