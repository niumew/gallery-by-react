require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';


// 获取图片数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);

var ImgFigure = React.createClass({
  render: function() {
    var styleObj = {};
    // 如果props属性指示了图片的位置， 则使用
    if (this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
   
    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
});

// 获取区间内的一个随机值
function getRangeRandom(low, high){
  return Math.ceil(Math.random() * (high - low) + low);
}

var GalleryByReactApp = React.createClass({
  Constant: {
      centerPos: {
        left: 0,
        right: 0
      },
      
      // 水平方向取值范围
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      // 垂直方向取值范围
      
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
   },
    // 重新布局所有图片
  rearrange: function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2), // 取一个或者不去
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        
        // 居中centerIndex图片
        imgsArrangeCenterArr[0].pos = centerPos;
        
        // 取出布局在上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        
        // 布局上侧图片
        imgsArrangeTopArr.forEach(function(value, index){
          imgsArrangeTopArr[index].pos = {
            top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          }
        });
        
        // 布局两侧图片
        for (var i=0, j=imgsArrangeArr.length, k=j/2; i<j; i++){
          var hPosRangeLORx = null;
          if (i<k){
            hPosRangeLORx = hPosRangeLeftSecX;
          } else {
            hPosRangeLORx = hPosRangeRightSecX;
          }
          
          imgsArrangeArr[i].pos = {
            top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
            left: getRangeRandom(hPosRangeLORx[0], hPosRangeLORx[1])
          }
        }
        
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  },
  
  getInitialState: function() {
    return {
        imgsArrangeArr: [
            /*{
                pos: {
                    left: '0',
                    top: '0'
                },
                rotate: 0,    // 旋转角度
                isInverse: false,    // 图片正反面
                isCenter: false,    // 图片是否居中
            }*/
        ]
    };
  },
  
  // 组件加载后，为每张图片设置其取值范围
  componentDidMount: function(){
    // 舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH  =Math.ceil(stageH / 2);
        
    // 一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
        
    // 计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    
    // 计算左侧、右侧图片布局取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    
    this.rearrange(0);
  },
  render: function() {
    var controllerUnits = [],
        imgFigures = [];
        
    imageDatas.forEach(function(value, index){
      if (!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left:0,
            top: 0
          }
        };
      }
      
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
    }.bind(this));
    
    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
              {imgFigures}
          </section>
          <nav className="controller-nav">
              {controllerUnits}
          </nav>
      </section>
    );
  }
});

class AppComponent extends React.Component {
  /*
  constant: {
      centerPos: {
        left: 0,
        right: 0
      },
      
      // 水平方向取值范围
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      // 垂直方向取值范围
      
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
   }
   
    // 重新布局所有图片
  rearrange(centerIndex){
    var imgsArrangeArr = this.stage.imgsArrangeArr,
        Constant = constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random * 2), // 取一个或者不去
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        
        // 居中centerIndex图片
        imgsArrangeCenterArr[0].pos = centerPos;
        
        // 取出布局在上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        
        // 布局上侧图片
        imgsArrangeTopArr.forEach(function(value, index){
          imgsArrangeTopArr[index].pos = {
            top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          }
        });
        
        // 布局两侧图片
        for (var i=0, j=imgsArrangeArr.length, k=j/2; i<j; i++){
          var hPosRangeLORx = null;
          if (i<k){
            hPosRangeLORx = hPosRangeLeftSecX;
          } else {
            hPosRangeLORx = hPosRangeRightSecX;
          }
          
          imgsArrangeArr[i].pos = {
            top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
            left: getRangeRandom(hPosRangeLORx[0], hPosRangeLORx[1])
          }
        }
        
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setStage({
          imgsArrangeArr: imgsArrangeArr
        });
  }
  
  getInitialState() {
    return {
      imgsArrangeArr:[]
    }
  }
  
  // 组件加载后，为每张图片设置其取值范围
  ComponentDidMount(){
    // 舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH  =Math.ceil(stageH / 2);
        
    // 一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
        
    // 计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    
    // 计算左侧、右侧图片布局取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    
    this.rearrange(0);
  }
  render() {
    var controllerUnits = [],
        imgFigures = [];
        
    imageDatas.forEach(function(value, index){
      if (!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left:0,
            top: 0
          }
        }
      }
      
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
     
      imgFigures.push(<ImgFigure data={value} />);
    }.bind(this));
    
    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
              {imgFigures}
          </section>
          <nav className="controller-nav">
              {controllerUnits}
          </nav>
      </section>
    );
  }
  */
  render() {
    return (
      <GalleryByReactApp />
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
