$(document).ready(function () {
    let loader = {
        loading: false,
        timer: null,
        start: function () {
            this.loading = true;
            this.timer = setTimeout(function () {
                $('#form').addClass('loading');
                this.timer = null;
            }, 100);
        },
        stop: function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.loading = false;
            $('#form').removeClass('loading');
        }
    }
    $('#form').submit(function (e) {
        e.preventDefault();
        if (loader.loading) { return false; }
        loader.start();
        $
            .ajax('dict', {
                method: 'POST',
                dataType: 'json',
                data: { key: $('#key').val() },
                timeout: 5000
            })
            .done(function (data) {
                let s = '';
                if (!data.length) {
                    s = 'Term not found!';
                }
                else {
                    data.forEach((i, idx) => {
                        let wt = i.wordtype || 'n.'
                        s += '<p>' + (idx + 1) + '(' + wt + ') :: ' + i.definition + '</p>';
                    });
                }
                $('#result').html(s);
            })
            .fail(function (e, textStatus, errorThrown ) {
                console.log(e)
                $('#result').html('Error: ' + textStatus);
            })
            .always(function () {
                loader.stop();
            });
        return false;
    });

});