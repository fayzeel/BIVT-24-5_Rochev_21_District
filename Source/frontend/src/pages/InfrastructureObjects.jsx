import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

function InfrastructureObjects() {
  const { isAdmin } = useAuth();
  const [objects, setObjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObject, setEditingObject] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    foundation_year: '',
    district_id: '',
    type_id: ''
  });

  useEffect(() => {
    loadObjects();
    loadDistricts();
    loadTypes();
  }, []);

  const loadObjects = async () => {
    try {
      const response = await axios.get('/api/infrastructure-object');
      setObjects(response.data);
    } catch (error) {
      console.error('Ошибка загрузки объектов:', error);
    }
  };

  const loadDistricts = async () => {
    try {
      const response = await axios.get('/api/district');
      setDistricts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки районов:', error);
    }
  };

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

  const filteredObjects = objects.filter(obj =>
    obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingObject(null);
    setFormData({
      name: '',
      address: '',
      foundation_year: '',
      district_id: '',
      type_id: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (obj) => {
    setEditingObject(obj);
    setFormData({
      name: obj.name,
      address: obj.address,
      foundation_year: obj.foundation_year || '',
      district_id: obj.district?.id || '',
      type_id: obj.type?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект?')) {
      try {
        await axios.delete(`/api/infrastructure-object/${id}`);
        loadObjects();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить объект');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        foundation_year: formData.foundation_year ? parseInt(formData.foundation_year) : null,
        district_id: formData.district_id ? parseInt(formData.district_id) : null,
        type_id: formData.type_id ? parseInt(formData.type_id) : null
      };

      if (editingObject) {
        await axios.put(`/api/infrastructure-object/${editingObject.id}`, data);
      } else {
        await axios.post('/api/infrastructure-object', data);
      }
      
      setIsModalOpen(false);
      loadObjects();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить объект');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getDistrictName = (districtId) => {
    const district = districts.find(d => d.id === districtId);
    return district ? district.name : '—';
  };

  const getTypeName = (typeId) => {
    const type = types.find(t => t.id === typeId);
    return type ? type.name : '—';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Объекты инфраструктуры</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Поиск по названию или адресу..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {isAdmin && (
        <button className="btn btn-primary" onClick={handleAdd}>
          + Добавить объект
        </button>
      )}

      <div className="table-container" style={{ marginTop: '1.5rem' }}>
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Адрес</th>
              <th>Район</th>
              <th>Тип</th>
              <th>Год постройки</th>
              {isAdmin && <th style={{ width: '150px' }}>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {filteredObjects.map(obj => (
              <tr key={obj.id}>
                <td><strong>{obj.name}</strong></td>
                <td>{obj.address}</td>
                <td>{obj.district?.name || getDistrictName(obj.district_id)}</td>
                <td>{obj.type?.name || getTypeName(obj.type_id)}</td>
                <td>{obj.foundation_year || '—'}</td>
                {isAdmin && (
                  <td>
                    <div className="actions">
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleEdit(obj)}
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Изменить
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(obj.id)}
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredObjects.length === 0 && (
        <div className="empty-state">
          <p>Объекты не найдены</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingObject ? 'Редактировать объект' : 'Добавить объект'}
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
            <label className="form-label">Адрес *</label>
            <input
              type="text"
              className="form-input"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Район</label>
            <select
              className="form-input"
              name="district_id"
              value={formData.district_id}
              onChange={handleChange}
            >
              <option value="">Не выбран</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Тип инфраструктуры</label>
            <select
              className="form-input"
              name="type_id"
              value={formData.type_id}
              onChange={handleChange}
            >
              <option value="">Не выбран</option>
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Год постройки</label>
            <input
              type="number"
              className="form-input"
              name="foundation_year"
              value={formData.foundation_year}
              onChange={handleChange}
              min="1000"
              max="3000"
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
              {editingObject ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default InfrastructureObjects;