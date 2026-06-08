import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

function InfrastructureTypes() {
  const { isAdmin } = useAuth();
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const response = await axios.get('/api/infrastructure-type');
      setTypes(response.data);
    } catch (error) {
      console.error('Ошибка загрузки типов:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTypes = types.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    setEditingType(null);
    setFormData({
      name: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тип?')) {
      try {
        await axios.delete(`/api/infrastructure-type/${id}`);
        loadTypes();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить тип');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await axios.put(`/api/infrastructure-type/${editingType.id}`, formData);
      } else {
        await axios.post('/api/infrastructure-type', formData);
      }
      
      setIsModalOpen(false);
      loadTypes();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить тип');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Типы инфраструктуры</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Поиск по названию или описанию..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {isAdmin && (
        <button className="btn btn-primary" onClick={handleAdd}>
          + Добавить тип
        </button>
      )}

      <div className="cards-grid" style={{ marginTop: '1.5rem' }}>
        {filteredTypes.map(type => (
          <div key={type.id} className="card">
            <h3 className="card-title">{type.name}</h3>
            {type.description && (
              <p className="card-text">{type.description}</p>
            )}
            {isAdmin && (
              <div className="actions" style={{ marginTop: '1rem' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handleEdit(type)}
                >
                  Изменить
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(type.id)}
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTypes.length === 0 && (
        <div className="empty-state">
          <p>Типы инфраструктуры не найдены</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? 'Редактировать тип' : 'Добавить тип'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Название *</label>
            <input
              type="text"
              className="form-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              className="form-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {editingType ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default InfrastructureTypes;