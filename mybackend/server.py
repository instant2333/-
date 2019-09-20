#encoding=utf-8
import json
from flask import Flask, request, Response, jsonify
import sql_op as op
import cv2 as cv

import os,sys,random,string
basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)


@app.route('/api/login', methods=['GET','POST'])
def login():
    if request.method == 'POST' and request.is_json:
        user_name = request.get_json()['username']
        user_passwd=request.get_json()['passwd']
        print("recive POST")
        result=op.check_login(user_name,user_passwd)
        return Response(
            result,
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
@app.route('/api/reg', methods=['GET','POST'])
def reg():
    if request.method == 'POST' and request.is_json:
        user_name = request.get_json()['username']
        user_passwd=request.get_json()['passwd']
        user_confirm_passwd=request.get_json()['confirm_passwd']
        user_email=request.get_json()['email']
        result=op.check_register(user_name,user_passwd,user_confirm_passwd,user_email)
        return Response(
            result,
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
@app.route('/api/submit_sell', methods=['GET','POST'])
def submit_sell():
    if request.method == 'POST' and request.is_json:
        if 'bookname' in request.json:
            bookname = request.get_json()['bookname']
        else: return  '1'

        origin = 'origin' in request.json and request.get_json()['origin']

        if 'sellprice' in request.json:
            sellprice = request.get_json()['sellprice']
        else: return '2'

        labels ='labels' in request.json and  request.get_json()['labels']
        intro = 'intro' in request.json and request.get_json()['intro']
        if 'ISBN' in request.json:
            ISBN = request.get_json()['ISBN']
        else: return '3'

        publisher = 'publisher' in request.json and request.get_json()['publisher']
        username ='username' in request.json and request.get_json()['username']

        if  sellprice.isdigit()==False:
            return '4'

        if 'image_url' in request.json:
            image_url = request.get_json()['image_url']
        else: return '5'

        return Response(
            op.submit_sell(bookname,origin,sellprice,labels,intro,ISBN,publisher,username,image_url),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
@app.route('/api/submit_buy', methods=['GET','POST'])
def submit_buy():
    if request.method == 'POST' and request.is_json:
        if 'bookname' in request.json:
            bookname = request.get_json()['bookname']
        else: return  '1'

        if 'buyprice' in request.json:
            buyprice = request.get_json()['buyprice']
        else: return '2'

        ISBN = 'ISBN' in request.json and request.get_json()['ISBN']
        publisher = 'publisher' in request.json and request.get_json()['publisher']
        username ='username' in request.json and request.get_json()['username']

        if  buyprice.isdigit()==False:
            return '3'

        return Response(
            op.submit_buy(bookname,buyprice,ISBN,publisher,username),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
@app.route('/api/upload', methods=['GET','POST'])
def uploadimg():
    if request.method == 'POST':
        img=request.files.get('file')
        ran_str = ''.join(random.sample(string.ascii_letters + string.digits, 16))
        path = basedir + "\\static\\img\\"
        imgName = ran_str + img.filename
        file_path = path + imgName
        img.save(file_path)
        url = './static/img/' + imgName
        return url

@app.route('/api/market_sell_data', methods=['GET','POST'])
def get_market_sell_data():
    if request.method == 'GET':
        return Response(
            op.market_sell_data(),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
@app.route('/api/search_book', methods=['GET','POST'])
def search_book():
    if request.method == 'POST':
        search_book_name = 'search_book_name' in request.json and request.get_json()['search_book_name']
        return Response(
            op.search_book(search_book_name),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
@app.route('/api/market_buy_data', methods=['GET','POST'])
def get_market_buy_data():
    if request.method == 'GET':
        return Response(
            op.market_buy_data(),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
@app.route('/api/user_order', methods=['GET','POST'])
def get_user_order():
    if request.method == 'POST':
        username = 'username' in request.json and request.get_json()['username']
        return Response(
            op.user_order(username),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
@app.route('/api/del_order', methods=['GET','POST'])
def del_order():
    if request.method == 'POST':
        record_id = 'id' in request.json and request.get_json()['id']
        type = 'type' in request.json and request.get_json()['type']
        return Response(
            op.del_order(record_id,type),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )

@app.route('/api/book_detail', methods=['GET','POST'])
def book_detail():
    if request.method == 'POST':
        record_id = 'id' in request.json and request.get_json()['id']
        type = 'type' in request.json and request.get_json()['type']
        return Response(
            op.book_detail(record_id,type),
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )

@app.route('/api/deal', methods=['GET','POST'])
def deal():
    if request.method == 'POST':
        loguser = 'loguser' in request.json and request.get_json()['loguser']
        username = 'username' in request.json and request.get_json()['username']
        type = 'type' in request.json and request.get_json()['type']
        price = 'price' in request.json and request.get_json()['price']
        id = 'id' in request.json and request.get_json()['id']
        deal_type = 'deal_type' in request.json and request.get_json()['deal_type']
        if type=="sell":
            result=op.deal_sell(username,loguser,price,id,deal_type)
        elif type=="buy":
            result = op.deal_buy(loguser, username, price,id,deal_type)
        return Response(
            result,
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )

@app.route('/api/get_comments', methods=['GET','POST'])
def comments():
    if request.method == 'POST':
        record_id = 'record_id' in request.json and request.get_json()['record_id']
        result = op.comments(record_id)
        return Response(
            result,
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )
@app.route('/api/push_comments', methods=['GET','POST'])
def push_comments():
    if request.method == 'POST':
        comment = 'comment' in request.json and request.get_json()['comment']
        username = 'username' in request.json and request.get_json()['username']
        id = 'id' in request.json and request.get_json()['id']
        result = op.push_comments(comment,username,id)
        return Response(
            result,
            mimetype='application/json',
            headers={
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            }
        )




if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=4000,
        debug=True
    )