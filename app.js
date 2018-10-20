var express = require('express');
var pgp = require('pg-promise')();
//var db =pgp(process.env.DATABASE_URL);
var db = pgp('postgres://snzadxroisaukx:adf58423ee26b3ecd30a3e8f1076764acc2365d3cd4eb0899a2d6c4d4c18cd8d@ec2-54-243-147-162.compute-1.amazonaws.com:5432/dbvugdbvctd4pk?ssl=true');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/////app.use(express.static('static'));
////app.use(express.static('static/about.html'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});
app.get('/about', function (req, res) {
    var name = 'Teerayut'
    var hobbies = ['music', 'movie']
    var bdate = '02/04/1998'
    res.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });
});
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products';

    if (id) {
        sql += ' where id =' + id +' order by id ASC';
    }

    db.any(sql +' order by id ASC')
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products: data })
        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })

});
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id=" + pid;
    db.any(sql)
        .then(function (data) {
            res.render('pages/products_edit', { products: data[0] })
        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});
app.get('/users', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from users ';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});
app.get('/users', function (req, res) {
    var id = req.params.pid;
    var sql = "select * from users where id =" + pid;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users_edit', { users: data[0] })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});
app.get('/index', function (req, res) {
    res.render('pages/index');
});
///update
app.post('/products/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title = '${title}',price = '${price}' where id = ${id} `;
    ////db.none
    db.none(sql);
    console.log('UPDATE:' + sql);
    res.redirect('/products');
});
app.post('/users/update', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql = `update users set email = '${email}',password = '${password}' where id = ${id} `;
    ////db.none
    db.none(sql);
    console.log('UPDATE:' + sql);
    res.redirect('/users');
});
//delete
app.get('/product_delete/:pid',function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM products';
    if (id){
            sql += ' where id ='+ id;
    }
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            res.redirect('/products');
    
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })
 });
//insert
app.get('/insert',function (req, res) {
    res.render('pages/insert'); 
})
app.post('/products/insert', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id,title,price)
    VALUES ('${id}', '${title}', '${price}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
app.get('/insert',function (req, res) {
    res.render('pages/insert'); 
})
app.post('/users/insertuser', function (req, res) {
    var id = req.body.id;
    var title = req.body.email;
    var price = req.body.password;
    var sql = `INSERT INTO users (id,email,password)
    VALUES ('${id}', '${email}', '${password}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')
        })

        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});


