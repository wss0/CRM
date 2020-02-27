$(function () {
    // 将当前操作的导航存到sessionStorage中
    sessionStorage.setItem('currentUrl','./page/userlist.html')
    let $tbody = $('.tableBox tbody'),
        $deleteAll = $('.deleteAll'),
        $selectAll = $('.tableBox thead .w3'),
        $handle = $('.tableBox thead .w12'),
        $selectItems = null,
        $deleteBtns = null,
        $resetBtns = null;

    let canShow = true;//判断当前的人有没有权限 有就显示

    function role() {
        //按照resetpassword权限进行判断
        let power = localStorage.getItem('power');
        if (power.indexOf('resetpassword') == -1) {
            canShow = false;
            $selectAll.hide();
            $handle.hide();
            $deleteAll.hide();
        }
    }
    role();
    function getData(options = {}) {
        //options是传进来的搜索条键
        axios.get('/user/list', {
            params: options
        }).then((data) => {
            console.log(data);
            render(data.data);
            $selectItems = $('.tableBox tbody input[type=checkbox]');
            eventBind();//数据渲染完成后 再去绑定点击事件
        }).catch(() => {
            alert('系统繁忙')
        })
    }
    function render(data = []) {
        let str = '';
        data.forEach(item => {
            let { id, name = '', sex = '', email = '', phone = '', deparment = '', jobId = '', job = '', desc = '' } = item
            str += `
            <tr>
            ${
                canShow ?
                    `<td class="w3"><input type="checkbox"></td>` : ''
                }
                
                <td class="w10">${name}</td>
                <td class="w5">${sex == 0 ? '男' : '女'}</td>
                <td class="w10">${deparment}</td>
                <td class="w10">${job}</td>
                <td class="w15">${email}</td>
                <td class="w15">${phone}</td>
                <td class="w20">${desc}</td>
                ${
                canShow ?
                    ` <td class="w12 btnBox">
                    <a href="./useradd.html?id=${id}">编辑</a>
                    <a href="javascript:;" data-id=${id}>删除</a>
                    <a href="./reset.html?id=${id}" data-id=${id}>重置密码</a>
                </td>`: ''
                }
                
        </tr>`
        });
        $tbody.html(str)
    }
    getData();

    //实现全选功能
    $selectAll.find('input').on('change', function () {
        console.log(this.checked)
        // $selectItems.attr('checked',this.checked)
        $selectItems.get().forEach(item => {
            item.checked = this.checked;
        })
    })
    function eventBind() {
        //给所有的删除按钮 和 重置按钮 绑定点击事件
        $deleteBtns = $('.tableBox tbody .btnBox a:nth-child(2)');
        $resetBtns = $('.tableBox tbody .btnBox a:nth-child(3)');
        $deleteBtns.on('click', function () {
            console.log(this);
            let ele = this;
            alert('确定删除吗？', {
                confirm: true,
                handled(type) {
                    console.log(type)
                    if (type == 'CONFIRM') {
                        //1怎么删除对应的id
                        //2删除成功后，前端怎么移除
                        deleteFn($(ele).attr('data-id'))
                    }
                }
            })
        })
        $resetBtns.on('click', function () {
            //点击跳转页面 重置密码
        })
    }
    function deleteFn(id) {
        axios.get('/user/delete', {
            params: {
                userId: id
            }
        }).then((data) => {
            if (data.code == 0) {
                //删除成功

            }
        })
    }
    //获取下拉列表展示的内容
    function initSelect() {
        axios.get('/department/list').then((data) => {
            let str = '<option value="0">全部</option>';
            data.data.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`
            });
            $('.selectBox').html(str);
        })
    }
    initSelect();
    //选中下拉框指定内容时执行的操作
    $('.selectBox').on('change', function () {
        console.log(this.value)
        getData({
            departmentId: this.value
        })
    })
    //实现搜索框
    $('.searchInp').on('keydown',function(e){
        if(e.keyCode ==13){
            getData({
                departmentId:$('.selectBox')[0].value,
                search:this.value
            })
            this.value = '';//敲回车清空搜索框内容
        }
    })
    //实现批量删除
    function batchDelete(){
        let items = $('tbody tr').get().filter(item=>{
            //返回true 就把当前像放到新数组  
            return $(item).find('input[type="checkbox"]')[0].checked;
        })
        //item 存放的是 选中的那几个 tr
        let ary = [];
        items.forEach(item=>{
            //获取要删除这条的id
            let id = $(item).find('a:nth-child(2)').attr('data-id');
            let p = axios.get('/user/delete?userId='+ id)
            ary.push(p)
        })
        axios.all(ary).then((data)=>{
            console.log(data)
        })
    }
    $deleteAll.on('click',batchDelete)
})


















