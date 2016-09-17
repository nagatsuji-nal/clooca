var React = require('react');
var Modal = require('react-modal');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#272525',
    color                 : '#fff'
  }
};


var CreateModal = React.createClass({

  getInitialState: function() {
    return {
    	eClassNames: [],
    	isOpen: false
    };
  },

  afterOpenModal: function() {
  },

  closeModal: function() {
  	this.props.onClose();
  },

  okModal: function() {
    var metamodel = clooca.getModelInterface().getRawMetaModel();
    var model = clooca.getModelInterface().getRawModel();
  	var name = this.refs.name.value;
    var eClassName = this.refs.eClass.value;
    var eClass = metamodel.get('resourceSet').elements('EClass').filter((_eclass) => {
      return _eclass.get('name') == eClassName;
    })[0];

    model.get('contents').add(eClass.create({name:name}));
    clooca.getModelInterface().fireUpdate()
  	this.props.onClose();
  },

  componentWillReceiveProps: function() {
  	var metamodel = clooca.getModelInterface().getRawMetaModel();
    var eClassNames = metamodel.get('resourceSet').elements('EClass').map((_eclass) => {
      return _eclass.get('name');
    });
  	this.setState({
  		eClassNames: eClassNames
  	});
  },

  render: function() {
    var options = this.state.eClassNames.map((eClassName) => {
      return (<option>{eClassName}</option>);
    });
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles} >

          <h2>インスタンス作成</h2>

          <div className="core-modal-form">
            <span className="core-modal-form-label">クラス名</span>
            <div className="core-modal-form-input">
              <select ref="eClass">{options}</select>
            </div>
          </div>
          <div className="core-modal-form">
            <span className="core-modal-form-label">作成するオブジェクトの名前</span>
            <div className="core-modal-form-input">
              <input ref="name" type="text" />
            </div>
          </div>
          <button onClick={this.okModal}>OK</button>
          <button onClick={this.closeModal}>Cancel</button>
        </Modal>
      </div>
    );
  }
});

module.exports = CreateModal;