const { NotFoundInCatch, error500, error404, error422 } = require('../lib/error');
const { getAllResponse, createResponse, updateResponse } = require('../lib/response');

const Order = require("../models/Order");



const checkOut = function (req, res, next) {

    const order = new Order({
        cart: req.body.cart,
        customer: req.user._id
    });

    order.save().populate('cart').populate('customer').then(function(err, order){
        if(err){ return next(err) }
        res.json(order);
        return order;
    }).then(function(order){
        res = sendInvoicePdf(order);
        next();
    });

}




const sendInvoicePdf =  (order) => {
    const currency = "$",
        orderTemplate = '',
        rowStyle = 'style="border-bottom: 1px solid #eee; padding: 5px;" ';

    /*Generation of order list*/
    (function(){
        order.cart[0].productIds.forEach(function(item, index){
            index += 1;

            orderTemplate +=
                '<tr>' +
                    '<td ' + rowStyle + '>' + index + '</td>' +
                    '<td ' + rowStyle + 'align="left">' + item.productName + '</td>' +
                    '<td ' + rowStyle + '>' + currency + item.price + '</td>' +
                    '<td ' + rowStyle + '>' + item.quantity + '</td>' +
                    '<td ' + rowStyle + '>' + currency + item.total + '</td>' +
                '</tr>';
        });
    })();

    /*HTML Mail Template*/
    var htmlBody = [
        '<div>',
            '<b>Hello ' + order.customer[0].name + '</b>.' + '\n',
            'Thanks for your order: ',
            '<table width="600px" cellpadding="0" cellspacing="0">',
                '<thead align="center">',
                    '<tr height="40"></tr>',
                    '<tr>',
                        '<th ' + rowStyle + '>#</th>',
                        '<th ' + rowStyle + 'align="left">Item</th>',
                        '<th ' + rowStyle + '>Price</th>',
                        '<th ' + rowStyle + '>Quantity</th>',
                        '<th ' + rowStyle + '>Total</th>',
                    '</tr>',
                '</thead>',
                '<tbody align="center">',
                    orderTemplate,
                    '<tr height="40"></tr>',
                    '<tr>',
                        '<td></td>',
                        '<td></td>',
                        '<td></td>',
                        '<td align="right"><b>Grand total: </b></td>',
                        '<td ' + rowStyle + '>' + currency + order.cart[0].total + '</td>',
                    '</tr>',
                    '<tr height="40"></tr>',
                '</tbody>',
            '</table>',
            'Our manager will contact you by the phone: ',
            '<b>' + order.customer[0].phoneNumber + '</b>',
        '<div>'
    ].join(' ');

    pdf.create(htmlBody).toStream((err, pdfStream) => {
      if (err) {   
        // handle error and return a error response code
        console.log(err)
        return res.sendStatus(500)
      } else {
        // send a status code of 200 OK
        res.statusCode = 200             
  
        // once we are done reading end the response
        pdfStream.on('end', () => {
          // done reading
          return res.end()
        })
  
        // pipe the contents of the PDF directly to the response
        pdfStream.pipe(res)
      }
    })
  }
  
  const  getAllOrders = (req, res, next)=> {

    Order.find({}, function(err, orders){
        if (err){ return err }

        res.json(orders);
    })

}

const getUserOrders = (req, res, next)=> {

   const customerId = req.user._id;

    Order.find({'customer': customerId}, function(err, orders){
        if (err){ return err }
        res.json(orders);
    });

}

  module.exports = {
    checkOut,
    getAllOrders,
    getUserOrders
  };