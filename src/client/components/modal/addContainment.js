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
    	containments: [],
      selectedContainment: null,
    	modalIsOpen: false
    };
  },

  afterOpenModal: function() {

  },

  closeModal: function() {
  	this.props.onClose();
  },

  okModal: function() {
    var model = this.props.model;
    var resourceSet = this.props.resourceSet;
  	var association = this.refs.association.value;
    var eclass = this.refs.eclass.value;
  	var name = this.refs.name.value;
    var eClass = resourceSet.elements('EClass').filter((eClass) => {
      return eClass.get('name') == eclass;
    })[0];
  	model.get(association).add(eClass.create({name:name}));
  	this.props.onClose();
  },

  componentWillReceiveProps: function(nextProps) {
    //eClass assoname
  	var model = nextProps.model;
    if(!model) return;
    var resourceSet = nextProps.resourceSet;
  	var containments = model.eClass.get('eAllContainments').map(function(asso) {
      let eType = asso.get('eType');
      if(eType.get('abstract') || eType.get('interface')) {
        var superTypes = resourceSet.elements('EClass').filter((eClass) => {
          return eClass.get('eSuperTypes').filter((eSuperType)=>{
            return eType.get('name') == eSuperType.get('name');
          }).length > 0;
        });
        var superTypeNames = superTypes.map((superType)=>{
          return superType.get('name');
        });
        return {
          name: asso.get('name'),
          eTypes: superTypeNames
        }
      }else{
        return {
          name: asso.get('name'),
          eTypes: [eType.get('name')]
        }
      }
  	});
  	this.setState({
  		containments: containments,
      selectedContainment: containments[0].name
  	});
  },

  onAssociationChange: function() {
    let association = this.refs.association.value;
    let selectedContainment = association;
    this.setState({
      selectedContainment: selectedContainment
    });
  },

  render: function() {
  	var options = this.state.containments.map(function(containment) {
  		return (<option key={'createmodal-'+containment.name}>{containment.name}</option>);
  	});
    var containment = this.state.containments.filter((containment) => {
      return containment.name == this.state.selectedContainment
    })[0];
    var options2 = containment?(containment.eTypes.map(function(eTypeName) {
      return (<option key={'createmodal-'+eTypeName}>{eTypeName}</option>);
    })):(<div/>);

    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles} >

          <h2>インスタンス作成</h2>
          <div className="core-modal-form">
            <span className="core-modal-form-label">関連名</span>
            <div className="core-modal-form-input">
              <select ref="association" onChange={this.onAssociationChange}>{options}</select>
            </div>
          </div>
          <div className="core-modal-form">
            <span className="core-modal-form-label">クラス名</span>
            <div className="core-modal-form-input">
              <select ref="eclass" onChange={this.onAssociationChange}>{options2}</select>
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