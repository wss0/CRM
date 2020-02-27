$(function () {
    //将当前操作的导航存储到session中
    sessionStorage.setItem('currentUrl','./page/departmentlist.html');
    //1.获取数据 展示列表2.权限判断 展示操作权3.点击对应按钮
    //点击编辑 带着id 调到 添加也  点击删除跳出 警示框 然后 是否 删除操作
    //setItem的第二个参数必须是字符串：存的时候是字符串 拿出来也是字符串JSON.parse转一下
    let power = localStorage.getItem('power');
    // let canShow = power.indexOf('resetpassword') == -1 ? false : true
    let canShow = power.includes('resetpassword');
    function getData() {
        axios.get('/department/list').then((data) => {
            if (data.code == 0) {
                render(data.data)
                eventBind();
            } else {
                alert('系统繁忙')
            }
        })
    }
    function render(ary) {
        let str = '';
        ary.forEach(item => {
            let { id, name, desc } = item;//数组结构是位置
            str += `
                    <tr>
                        <td class="w10">${id}</td>
                        <td class="w20">${name}</td>
                        <td class="w40">${desc}</td>
                        ${
                            canShow ?
                            `
                            <td class="w20 btnBox">
                                <a href="./departmentadd.html?departmentId=${id}">编辑</a>
                                <a href="javascript:;" class="delBtn" departmentId=${id}>删除</a>
                            </td>`:''
                        }                       
                    </tr>
                 `
        });
        $('.tableBox tbody').html(str);
    }
    getData();
    if (!canShow) {
        $('.btnBox').hide();
    }
    function del(id){
        axios.get('/department/delete?departmentId='+id)
    }
    //实现时间绑定
    function eventBind(){
        //实现事件的绑定
        $('.delBtn').on('click',function(){
            let id = $(this).attr('departmentId');
            alert('确定删除',{
                title:'警告',
                confirm:true,
                handled(type){
                    if(type == 'CONFIRM'){
                        //确定删除
                        del(id)
                    }
                }
            })
        })
    }
})