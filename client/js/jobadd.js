$(function () {
    //将当前操作的导航存储到session中
    sessionStorage.setItem('currentUrl', './page/joblist.html');
    let $inp = $('input[type=text]'),
        $textA = $('textarea'),
        $checks = $('input[name=job]');
    let jobId = location.href.queryURLParams().jobId;
    if (jobId) {
        //编辑
        axios.get('/job/info?jobId=' + jobId).then((data) => {
            $inp.val(data.data.name);
            $textA.val(data.data.desc);
            let p = data.data.power;
            $checks.get().forEach(item => {
                item.checked = p.includes(item.value)//p中有没有这个权限名
            });
        })
    }

    $('.submit').on('click', function () {
        let url = jobId ? 'job/update' : '/job/add'
        let obj = {};
        jobId ? obj.jobId = jobId : null;
        
        let options = {
            name: $inp.val(),
            desc: $textA.val(),
            power: $checks.get().filter(item => item.checked).map(item => item.value).join('|')
        }
        if (options.name) {
            axios.post(url, Object.assign(options, obj))
        }else{            
            alert('职务名称不为空',{
                handled(){
                    $inp[0].focus();
                }
            });           
        }        
    })
})