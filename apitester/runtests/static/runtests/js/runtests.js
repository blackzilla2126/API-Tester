$(function() {
	function escapeHTML(s) {
		return String(s).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
    function stripDotsFromId (id) {
        return String(id).replace(/\./g, '')
    }

    function runTestCallback (runner, thisRef) {
        return function (data) {
            var alertType = 'success';
            var msg = '';
            var collapse = '';
            var text = `<pre>${escapeHTML(data['text'])}</pre>`;
            console.log(thisRef)
            if(thisRef) {
                $(thisRef).removeClass('btn-default')
                $(thisRef).addClass('btn-success')
            }
            if (!data['success']) {
                alertType = 'danger';
                msg = '<ul>';
                for (var i=0; i < data['messages'].length; i++) {
                    msg += `<li>${data['messages'][i]}</li>`;
                }
                msg += '</ul>';
            } else {
                collapse = `<button type='button' class='btn btn-xs btn-success pull-right' data-toggle='collapse' data-target='#${stripDotsFromId(data['config']['operation_id'])}' aria-expanded='false'><span class='glyphicon glyphicon-chevron-right'></span><span class='glyphicon glyphicon-chevron-down'></span></button>`;
                text = `<div id='${stripDotsFromId(data['config']['operation_id'])}' class='collapse'>${text}</div>`;
            }
            var result =`<div class='alert alert-${alertType}'><div class='row'><div class='col-xs-10 col-sm-11'>${data['config']['summary']}<br />${data['config']['urlpath']}<br />Took ${data['execution_time']} ms<br />${msg}</div><div class='col-xs-2 col-sm-1'>${collapse}</div></div>${text}</div>`;
            $(runner.find('.result')).append(result);
        }
    }
	function runTest(runner, thisRef = null) {
		//var testpath = runner.data('testpath');
		jsonBody = $(runner).find('textarea[name="params"]').val();
		operationId = $(runner).find('input[type="hidden"]').val();
		order = $(runner).find('input[name="order"]').val();
		replica_id = $(runner).find('input[name="replica_id"]').val();
		remark = $(runner).find('textarea[name="remark"]').val();
		testmethod = $(runner).find('input[name="method"]').val();
        testconfig_pk = $(runner).find('input[name="testconfig_pk"]').val();
        path = $(runner).find('input[name="urlpath"]').val();
		testpath = 'run/' + testmethod + "/" + path + "/" + testconfig_pk  + "/"+ operationId   ;
        console.log(thisRef)
		$.post(testpath,  {
            'json_body': jsonBody,
            'csrfmiddlewaretoken': window.CSRF
        }, runTestCallback(runner, thisRef));
	}

    function deleteTest(runner){
        var item_list = $(runner).parent();
        jsonBody = $(runner).find('textarea[name="params"]').val();
        operationId = $(runner).find('input[type="hidden"]').val();
        order = $(runner).find('input[name="order"]').val();
        urlpath = $(runner).find('input[name="urlpath"]').val();
        replica_id = $(runner).find('input[name="replica_id"]').val();
        remark = $(runner).find('textarea[name="remark"]').val();

        $.post('/runtests/delete/json_body', {
            'json_body': jsonBody,
            'operation_id': operationId,
            'profile_id' : window.CURRENT_PROFILE_ID,
            'order': order,
            'urlpath': urlpath,
            'replica_id':replica_id,
            'remark':remark,
            'csrfmiddlewaretoken': window.CSRF
		}, function (response) {
        	$(item_list).remove();
        });
    }

	$('#run').click(function() {
		$('.result').empty();
		var runners = $('.runner');
		var runNum =$('#numRun');
		for(var j=0; j < $(runNum).val(); j++){
            for (var i=0; i < runners.length; i++) {
                var runner = $(runners[i]);
                if (runner.find('input').is(':checked')) {
                    runTest(runner);
                }
            }
		}
	});

	$('.runner button.forTest').click(function() {
		var runner = $(this).parent().parent().parent();
		$(runner).find('.result').empty();
		$(this).removeClass('btn-success')
	    $(this).addClass('btn-default')

		runTest(runner, this);
	});

    $('.runner button.forSave').click(function() {
    	var t = $(this);
        var runner = $(this).parent().parent().parent();
        jsonBody = $(runner).find('textarea[name="params"]').val();
		operationId = $(runner).find('input[type="hidden"]').val();
		order = $(runner).find('input[name="order"]').val();
		urlpath = $(runner).find('input[name="urlpath"]').val();
		replica_id = $(runner).find('input[name="replica_id"]').val();
		remark = $(runner).find('textarea[name="remark"]').val();
		testmethod = $(runner).find('input[name="method"]').val();

        $.post('/runtests/save/json_body', {
        	'json_body': jsonBody,
			'operation_id': operationId,
			'profile_id' : window.CURRENT_PROFILE_ID,
            'order': order,
			'urlpath': urlpath,
			'replica_id':replica_id,
			'remark':remark,
			'method':testmethod,
            'csrfmiddlewaretoken': window.CSRF
		}, function (response) {
        	t.next().show().fadeOut(1000);
        	location.reload();
        });
    });

    $('.runner button.forCopy').click(function() {
        var t = $(this);
        var runner = $(this).parent().parent().parent();
        var item_list = $(runner).parent();
        jsonBody = $(runner).find('textarea[name="params"]').val();
		operationId = $(runner).find('input[type="hidden"]').val();
		order = $(runner).find('input[name="order"]').val();
		urlpath = $(runner).find('input[name="urlpath"]').val();
		replica_id = $(runner).find('input[name="replica_id"]').val();
		remark = $(runner).find('textarea[name="remark"]').val();
        testmethod = $(runner).find('input[name="method"]').val();

        $.post('/runtests/copy/json_body', {
        	'json_body': jsonBody,
			'operation_id': operationId,
			'profile_id' : window.CURRENT_PROFILE_ID,
            'order': order,
			'urlpath': urlpath,
			'replica_id':replica_id,
			'remark':remark,
			'method':testmethod,
            'csrfmiddlewaretoken': window.CSRF
		}, function (response) {
		    $(item_list).clone(true).insertAfter($(item_list));
        });
    });

    $('.runner button.forDelete').click(function() {
        var runner = $(this).parent().parent().parent();
        deleteTest(runner)
	});

	$('#checkNone').click(function() {
		$('.runner').find('input').prop('checked', false);
	});

	$('#checkAll').click(function() {
		$('.runner').find('input').prop('checked', true);
	});

    $('#removeUncheck').click(function() {
		var runners = $('.runner');

        for (var i=0; i < runners.length; i++) {
            var runner = $(runners[i]);
            if (!runner.find('input').is(':checked')) {
                deleteTest(runner)
            }
        }
	});

    $('#api-add').click(function () {
        var selected = $('#select-api').val();
        $.post('/runtests/add/api', {
            'operation_id': selected,
            'profile_id' : window.CURRENT_PROFILE_ID,
            'csrfmiddlewaretoken': window.CSRF
        }, function (response) {
            location.reload();
        });
    });

    $('#select-testconfig').change(function() {
        var configPk = $(this).val();
        if (configPk) {
            location.href = URL_RUNTESTS_INDEX+configPk;
        } else  {
            location.href = URL_RUNTESTS_INDEX;
        }
    });

    var configPk = location.href.substr(location.href.lastIndexOf('/') + 1);
    if (configPk) {
        $('#nothing-selected').addClass('hide');
        $('#select-testconfig').val(configPk);
        $('#run-buttons').removeClass('hide');
        $('#test-list').removeClass('hide');
    }
});
