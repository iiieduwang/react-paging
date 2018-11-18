import React, { Component } from 'react';
import logo from './logo.svg';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import $ from 'jquery';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      totalPage: 0,
      currentPage: 1,
      perPage: 10,  //一次10筆資料
      upperPageBound: 3,  //設定每組最高的分頁數字
      lowerPageBound: 0,  //設定每組最低的分頁數字
      isPrevBtnActive: 'disabled',
      isNextBtnActive: '',
      pageBound: 3 //設定每組會有幾個分頁數字
    }
  }
  //按下...計算下一組要產生的分頁數字
  btnIncrementClick = () => {
    this.setState({
      upperPageBound: this.state.upperPageBound + this.state.pageBound,
      lowerPageBound: this.state.lowerPageBound + this.state.pageBound
    });
    let listid = this.state.upperPageBound + 1;
    this.getProducts(listid)
  }
  //按下...計算上一組要產生的分頁數字
  btnDecrementClick = () => {
    this.setState({
      upperPageBound: this.state.upperPageBound - this.state.pageBound,
      lowerPageBound: this.state.lowerPageBound - this.state.pageBound
    });
    let listid = this.state.upperPageBound - this.state.pageBound;
    this.getProducts(listid)
  }

  btnPrevClick = () => {
    if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
      this.setState({ 
        upperPageBound: this.state.upperPageBound - this.state.pageBound,
        lowerPageBound: this.state.lowerPageBound - this.state.pageBound
       });
    }
    let listid = this.state.currentPage - 1;
    this.getProducts(listid)
  }

  btnNextClick = () => {
    if ((this.state.currentPage + 1) > this.state.upperPageBound) {
      this.setState({ 
        upperPageBound: this.state.upperPageBound + this.state.pageBound,
        lowerPageBound: this.state.lowerPageBound + this.state.pageBound
      });
    }
    let listid = this.state.currentPage + 1;
    this.getProducts(listid)
  }
  componentDidMount() {
    this.getProducts(1);
  }
  componentDidUpdate() {
    $("ul li.active").removeClass('active');
    $('ul li#'+this.state.currentPage).addClass('active');
  }
  paging = e => {
    e.preventDefault();
    this.getProducts($(e.target).text())
  }
  getProducts(page) {
    fetch("http://localhost:3000/api/products/" + page)
      .then(res => res.json())
      .then(product => {
        this.setState({
          products: product.datas,
          totalPage: Math.ceil(product.TotalCount / this.state.perPage), //計算出總共幾頁
          currentPage: page
        })

        //計算 prev next 按鈕是否出現
        this.setState({isNextBtnActive: 'disabled'});
        this.setState({isPrevBtnActive: 'disabled'});
        if (this.state.totalPage === parseInt(page) && this.state.totalPage > 1) {
          this.setState({ isPrevBtnActive: '' });
        }
        else if (parseInt(page) === 1 && this.state.totalPage > 1) {
          this.setState({ isNextBtnActive: '' });
        }
        else if (this.state.totalPage > 1) {
          this.setState({ isNextBtnActive: '' });
          this.setState({ isPrevBtnActive: '' });
        }

      })

  }
  render() {
    const { totalPage, currentPage, perPage, upperPageBound, lowerPageBound, isPrevBtnActive, isNextBtnActive } = this.state;

    //產生頁碼
    const pageNumbers = [];
    for (let i = 1; i <= totalPage; i++) {
      pageNumbers.push(i);
    }

    //產生數字的分頁按鈕
    const renderPageNumbers = pageNumbers.map(number => {
      if (number === 1 && currentPage === 1) {
        return (
          <li key={number} className='page-item' id={number}><a href='#' className="page-link" id={number} onClick={this.paging}>{number}</a></li>
        )
      }
      else if ((number < upperPageBound + 1) && number > lowerPageBound) {
        return (
          <li key={number} id={number} className='page-item'><a href='#' className="page-link" id={number} onClick={this.paging}>{number}</a></li>
        )
      }
    });

    //按下...產生下一組分頁數字
    let pageIncrementBtn = null;
    if (pageNumbers.length > upperPageBound) {
      pageIncrementBtn = <li className="page-item"><a href='#' className="page-link" onClick={this.btnIncrementClick}> &hellip; </a></li>
    }
    //按下...產生上一組分頁數字
    let pageDecrementBtn = null;
    if (lowerPageBound >= 1) {
      pageDecrementBtn = <li className="page-item"><a href='#' className="page-link" onClick={this.btnDecrementClick}> &hellip; </a></li>
    }

    //判斷是否產生prev按鈕
    let renderPrevBtn = null;
    if (isPrevBtnActive !== 'disabled') {    
    renderPrevBtn = <li className="page-item"><a className="page-link" href='#' id="btnPrev" onClick={this.btnPrevClick}> 上一筆 </a></li>
    }

    //判斷是否產生next按鈕
    let renderNextBtn = null;
    if (isNextBtnActive !== 'disabled') {
      renderNextBtn = <li className="page-item"><a className="page-link" href='#' id="btnNext" onClick={this.btnNextClick}> 下一筆 </a></li>
    }
    return (
      <div className="container">
        <div className="card-columns">
          {this.state.products.map(product =>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.ProductName}</h5>
                <p className="card-text">ProductId：{product.ProductID}</p>
                <p className="card-text">UnitPrice：{product.UnitPrice}</p>
                <p className="card-text"><small class="text-muted">剩餘庫存：{product.UnitsInStock}</small></p>
              </div>
            </div>
          )}
        </div>
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            {renderPrevBtn}
            {pageDecrementBtn}
            {renderPageNumbers}
            {pageIncrementBtn}
            {renderNextBtn}
          </ul>
        </nav>
      </div>
    );
  }
}

export default App;
