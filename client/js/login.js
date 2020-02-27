$(function () {
    //当DOM结构加载完成之后执行该函数 $.ready()
    $('.submit').on('click', function (e) {
        let account = $('input[type=text]').val();
        let password = $('input[type=password]').val();
        if (!account || !password) {
            alert('用户名或密码不能为空！')
            return
        }
        password = md5(password)//对密码进行MD5加密
        axios.post('/user/login', {
            account, password
        }).then((data) => {
            //登录成功 1.跳转到首页 2.存储权限信息
            console.log(data)
            if (data.code == 0) {
                //密码正确
                alert('登录成功！',{
                    handled: function () {
                        //点击关闭 跳转到主页
                        location.href = './index.html'
                    }
                                
                })
                 //权限存储 
                localStorage.setItem('power',data.power);  
                //存储用户名
                localStorage.setItem('username',account);             
            } else {
                //密码成功
                alert('账号或密码错误！')
            }
        }, (err) => {
            //登录失败
            alert('系统繁忙！')
            console.log(err)
        })
    })
})
