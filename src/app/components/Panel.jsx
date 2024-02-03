"use client"
import React, { useState, useEffect } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { FaShoppingCart, FaTrashAlt, FaShoppingBag, FaTimes, FaSearch, FaMinus, FaPlus, FaStar } from 'react-icons/fa';
import Modal from 'react-modal';
import { useTable } from 'react-table';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

function Panel() {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [checkoutModalIsOpen, setCheckoutModalIsOpen] = useState(false);
  const [selectedNumara, setSelectedNumara] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/my_app/staticjson/');
      const jsonData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);

  const totalAmount = cart.reduce((total, item) => total + item.totalPrice, 0);

  const filteredData = data.filter((item) =>
    searchTerm.split(' ').every((term) =>
      item.marka.toLowerCase().includes(term.toLowerCase()) ||
      item.fiyat.toString() === term ||
      item.yıldız.toString() === term ||
      item.numaralar.some(n => n.numara.toString() === term)
    )
  );

  const addToCart = (item, numara) => {
    if (!numara) {
      alertify.notify('Önce numara seçmelisiniz!', 'error', 5);
      return;
    }
    let numaraStok = item.numaralar.find(n => n.numara === numara).stok;
    if (numaraStok === 0) {
      alertify.notify('Bu numaranın stoğu tükendi!', 'error', 5);
      return;
    }
    let newCart = [...cart];
    let itemInCart = newCart.find(i => i.id === item.id && i.numara === numara);
    if (itemInCart) {
      itemInCart.count++;
      itemInCart.totalPrice = itemInCart.count * item.fiyat;
    } else {
      newCart.push({ ...item, count: 1, totalPrice: item.fiyat, numara: numara });
    }
    setCart(newCart);
    let newData = [...data];
    let itemInData = newData.find(i => i.id === item.id);
    let numaraInData = itemInData.numaralar.find(n => n.numara === numara);
    numaraInData.stok--;
    setData(newData);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 1000);
    alertify.notify(`${item.marka}(${numara}) sepete eklendi!`, 'success', 5);
  };

  const removeFromCart = (itemToRemove) => {
    let newCart = [...cart];
    let itemIndex = newCart.findIndex((item) => item.id === itemToRemove.id && item.numara === itemToRemove.numara);
    if (itemIndex !== -1) {
      let newData = [...data];
      let itemInData = newData.find(i => i.id === itemToRemove.id);
      let numaraInData = itemInData.numaralar.find(n => n.numara === itemToRemove.numara);
      numaraInData.stok += newCart[itemIndex].count;
      newCart.splice(itemIndex, 1);
      setCart(newCart);
      setData(newData);
    }
  };

  const increaseCount = (itemToIncrease) => {
    let newCart = [...cart];
    let itemInCart = newCart.find(item => item.id === itemToIncrease.id && item.numara === itemToIncrease.numara);
    if (itemInCart) {
      let newData = [...data];
      let itemInData = newData.find(i => i.id === itemToIncrease.id);
      let numaraInData = itemInData.numaralar.find(n => n.numara === itemToIncrease.numara);
      if (numaraInData.stok > 0) {
        itemInCart.count++;
        itemInCart.totalPrice = itemInCart.count * itemInCart.fiyat;
        numaraInData.stok--;
        setCart(newCart);
        setData(newData);
      } else {
        alertify.notify('Bu numaranın stoğu tükendi!', 'error', 5);
      }
    }
  };

  const decreaseCount = (itemToDecrease) => {
    let newCart = [...cart];
    let itemInCart = newCart.find(item => item.id === itemToDecrease.id && item.numara === itemToDecrease.numara);
    if (itemInCart) {
      if (itemInCart.count > 1) {
        itemInCart.count--;
        itemInCart.totalPrice = itemInCart.count * itemInCart.fiyat;
        let newData = [...data];
        let itemInData = newData.find(i => i.id === itemToDecrease.id);
        let numaraInData = itemInData.numaralar.find(n => n.numara === itemToDecrease.numara);
        numaraInData.stok++;
        setData(newData);
      } else {
        removeFromCart(itemToDecrease);
      }
      setCart(newCart);
    }
  };

  const purchaseItems = () => {
    if (cart.length === 0) {
      alertify.notify('Sepet boş!', 'error', 5);
    } else {
      setCheckoutModalIsOpen(true);
    }
  };

  const completePurchase = () => {
    setCart([]);
    alertify.notify('Alışverişiniz tamamlanmıştır!', 'success', 5);
    setModalIsOpen(false);
    setCheckoutModalIsOpen(false);
  };


  const confirmClearCart = () => {
    let newData = [...data];
    cart.forEach(itemInCart => {
      let itemInData = newData.find(i => i.id === itemInCart.id);
      let numaraInData = itemInData.numaralar.find(n => n.numara === itemInCart.numara);
      numaraInData.stok += itemInCart.count;
    });
    setData(newData);
    setCart([]);
    setConfirmModalIsOpen(false);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="fixed top-0 right-0 p-4 flex justify-end items-center">
        <div className="flex items-center">
          {isSearchOpen && (
            <input
              type="text"
              placeholder="Ara..."
              onChange={(event) => setSearchTerm(event.target.value)}
              className='rounded-xl text-center mr-3'
            />
          )}
          <FaSearch onClick={() => setIsSearchOpen(!isSearchOpen)} className="cursor-pointer text-rose-50 h-6 w-6" />
        </div>
        <div className="relative ml-4 cursor-pointer" onClick={() => setModalIsOpen(true)}>
          {cart.length > 0 && (
            <>
              <FaShoppingCart className={`cart-icon text-violet-900 h-12 w-12 ${isBouncing ? 'bounce' : ''}`} />
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                borderRadius: '50%',
                border: '1px solid gray',
                backgroundColor: 'white',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
              }}>
                <Badge bg="secondary">{cart.length}</Badge>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-16">
      {filteredData.map((item, index) => (
        <div key={index} className="card">
          <img src={item.image} alt={item.marka} className="card-image" />
          {item.numaralar.every(n => n.stok === 0) && <div className="stock-out">STOK TÜKENDİ</div>}
          <h2 className="card-title font-bold">{item.marka}</h2>
          <p className="card-text font-semibold">{`${item.fiyat} TL`}</p>
          <div className="card-text flex">
            {Array(item.yıldız).fill().map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <div className="flex space-x-2">
            {item.numaralar.map((numaraObj) => (
              <button className={`numara-button border-2 rounded-full ${selectedNumara[item.id] === numaraObj.numara ? 'border-green-500 bg-green-200' : numaraObj.stok === 0 ? 'border-red-500 bg-red-200' : 'border-gray-300 bg-white'}`} 
              onClick={() => setSelectedNumara({...selectedNumara, [item.id]: numaraObj.numara})} style={{ fontSize: '20px', padding: '10px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>{numaraObj.numara}</button>
            ))}
          </div>
          {item.numaralar.some(n => n.stok > 0) ? (
            <button className="card-button mt-2 transform active:scale-90" onClick={() => addToCart(item, selectedNumara[item.id])}>Ekle</button>
          ) : (
            <button className="card-button mt-2 transform active:scale-90" disabled style={{ backgroundColor: '#800080' }}>Stokta             Yok</button>
            )}
          </div>
        ))}
        </div>
        <Modal 
          isOpen={modalIsOpen} 
          onRequestClose={() => setModalIsOpen(false)}
          style={{
            content: {
              width: 'auto',
              height: 'auto',
              margin: 'auto',
            },
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Sepet</h2>
            <FaTimes onClick={() => setModalIsOpen(false)} className="cursor-pointer text-red-500 h-6 w-6" />
          </div>
          {cart.length === 0 ? (
            <p>Sepetiniz boş.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adet
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {cart.map((item, index) => {
                const itemInData = data.find(i => i.id === item.id);
                const numaraInData = itemInData.numaralar.find(n => n.numara === item.numara);
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{`${item.marka} (${item.numara})`}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{`${item.fiyat} TL`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                        {item.count > 1 && <FaMinus onClick={() => decreaseCount(item)} className="cursor-pointer text-red-500 h-6 w-6" />}
                        <span>{item.count}</span>
                        {numaraInData.stok > 0 && <FaPlus onClick={() => increaseCount(item)} className="cursor-pointer text-green-500 h-6 w-6" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {`${item.totalPrice.toFixed(2)} TL`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="flex items-center bg-red-500 text-white rounded px-4 py-2 cursor-pointer" onClick={() => removeFromCart(item)}>
                        <FaTrashAlt className="mr-2" />
                        <span>Siparişi İptal Et</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              </tbody>
            </table>
          )}
            <div className="flex flex-row justify-end items-center mt-4 space-x-4">
            <button className="flex items-center bg-green-500 text-white rounded px-4 py-2 cursor-pointer" onClick={purchaseItems}>
              <FaShoppingBag className="mr-2" />
              <span>Satın Al</span>
            </button>
            <button className="flex items-center bg-red-500 text-white rounded px-4 py-2 cursor-pointer" onClick={() => setConfirmModalIsOpen(true)}>
              <FaTrashAlt className="mr-2" />
              <span>Sepeti Temizle</span>
            </button>
          </div>
        </Modal>
        <Modal 
          isOpen={confirmModalIsOpen} 
          onRequestClose={() => setConfirmModalIsOpen(false)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '40%',
              height: '40%',
            },
          }}
        >
        <h2 className="text-2xl font-bold mb-4">Sepeti Temizle</h2>
        <p className="mb-4">Sepetinizi temizlemek istediğinize emin misiniz?</p>
        <div className="flex justify-between">
          <button className="bg-green-500 text-white rounded px-4 py-2" onClick={confirmClearCart}>Evet</button>
          <button className="bg-red-500 text-white rounded px-4 py-2" onClick={() => setConfirmModalIsOpen(false)}>Hayır</button>
        </div>
      </Modal>
        <Modal 
          isOpen={checkoutModalIsOpen} 
          onRequestClose={() => setCheckoutModalIsOpen(false)}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '40%',
              height: '40%',
            },
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Alışverişi Tamamla</h2>
          <div className="mb-4">
          {cart.map((item, index) => (
            <p key={index}>{`${item.marka} (${item.numara}) - Adet: ${item.count} - Fiyat: ${item.totalPrice.toFixed(2)} TL`}</p>
          ))}
          </div>
          <p className="mb-4">{`Toplam Ücret: ${totalAmount.toFixed(2)} TL`}</p>
          <p className="mb-4">{`Saat: ${new Date().toLocaleTimeString()}`}</p>
          <div className="flex justify-between">
            <button className="bg-green-500 text-white rounded px-4 py-2" onClick={completePurchase}>Onayla</button>
            <button className="bg-red-500 text-white rounded px-4 py-2" onClick={() => setCheckoutModalIsOpen(false)}>Vazgeç</button>
          </div>
        </Modal>
      </div>
    );
  }
  
  export default Panel;
  
