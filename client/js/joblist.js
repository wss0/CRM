$(function () {
    //将当前操作的导航存储到session中
    sessionStorage.setItem('currentUrl', './page/joblist.html');
    let obj = {
        userhandle: '员工操作权',
        departhandle: '部门操作权',
        jobhandle: '职务操作权',
        departcustomer: '部门全部客户',
        allcustomer: '公司全部客户',
        resetpassword: '重置密码'
    };
    function trans(power = '') {
        let ary = power.split('|');
        return ary.map(item => {
            return obj[item]
        }).join('|');
    }

    let power = localStorage.getItem('power');
    let canShow = power.includes('resetpassword');
    if (!canShow) {
        $('.btnBox').remove();
    }

    function getData() {
        axios.get('/job/list').then((data) => {
            if (data.code == 0) {
                render(data.data)
                eventBind();
            } else {
                alert
                alert('系统繁忙')
            }
        })
    }
    function render(ary) {
        let str = '';
        ary.forEach(item => {
            let { desc, id, name, power } = item
            str += `
            <tr>
                <td class="w8">${id}</td>
                <td class="w10">${name}</td>
                <td class="w20">${desc}</td>
                <td class="w50">${trans(power)}</td>
                ${
                canShow ? `
                    <td class="w12 btnBox">
                        <a href="./jobadd.html?jobId=${id}">编辑</a>
                        <a href="javascript:;" class='delBtn' jobId=${id}>删除</a>
                    </td>`: ''
                }
                
            </tr>
            `
        });
        $('tbody').html(str)
    }
    getData();
    function eventBind() {
        $('.delBtn').on('click', function () {
            let id = $(this).attr('jobId');
            alert('确定删除？', {
                confirm: true,
                handled(type) {
                    if (type == 'CONFIRM') {
                        //确定删除
                        axios.get('/job/delete?jobId=' + id)
                    }
                }
            })
        })
    }


})