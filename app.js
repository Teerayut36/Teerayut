var express = require('express');
var pgp = require('pg-promise')();
//var db =pgp(process.env.DATABASE_URL);
var db = pgp('postgres://snzadxroisaukx:adf58423ee26b3ecd30a3e8f1076764acc2365d3cd4eb0899a2d6c4d4c18cd8d@ec2-54-243-147-162.compute-1.amazonaws.com:5432/dbvugdbvctd4pk?ssl=true');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
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
        sql += ' where id =' + id + ' order by id ASC';
    }

    db.any(sql + ' order by id ASC')
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
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from products where id=" + pid;
    db.any(sql)
        .then(function (data) {
            res.render('pages/products_edit', { products: data[0],time: time })
        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});
app.get('/users', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from users ';
    if (id) {
        sql += ' where id =' + id + ' order by id ASC';
    }
    db.any(sql + ' order by id ASC')
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});
app.get('/users/:pid', function (req, res) {
    var pid = req.params.pid;
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from users where id =" + pid;
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users_edit', { users: data[0],time: time })

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
app.get('/product_delete/:pid', function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
app.get('/user_delete/:pid', function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })
});
//insert

app.post('/products/insert', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time = req.body.time;
    var sql = `INSERT INTO products (id,title,price,created_at)
     VALUES ('${id}', '${title}', '${price}', '${time}')`;
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

app.post('/users/insertuser', function (req, res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var time = req.body.time;
    var sql = `INSERT INTO users (id,email,password,created_at) 
    VALUES ('${id}', '${email}', '${password}', '${time}')`;
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
//date
app.get('/insert', function (req, res) {
    var time = moment().format();
    res.render('pages/insert', { time: time });
});
app.get('/insertuser', function (req, res) {
    var time = moment().format();
    res.render('pages/insertuser', { time: time });
});
//report 
app.get('/product_report', function(req, res) {
    var sql ='SELECT products.id,products.title,products.price,products.tags,sum(purchase_items.quantity) as quantity,sum(purchase_items.price) as price FROM products,purchase_items where products.id=purchase_items.product_id group by products.id order by products.id ASC;select sum(quantity) as squantity,sum(price) as sprice from purchase_items';
    db.multi(sql)
    .then(function  (data) 
    {
        // console.log('DATA' + data);
        res.render('pages/product_report', { product: data[0],sum: data[1]});
    })
    .catch(function (data) 
    {
        console.log('ERROR' + error);
    })
});

app.get('/users_report', function(req, res) {
    var sql='select purchases.user_id,purchases.name,users.email,sum(purchase_items.price) as price from purchases,users,purchase_items where purchases.user_id=users.id group by purchases.user_id,purchases.name,users.email order by sum(purchase_items.price) desc LIMIT 30;'
    db.any(sql)
        .then(function (data) 
        {
            // console.log('DATA' + data);
            res.render('pages/users_report', { user : data });
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});


