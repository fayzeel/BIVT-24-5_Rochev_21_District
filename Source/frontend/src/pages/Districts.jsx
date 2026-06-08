import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

function Districts() {
  const { isAdmin } = useAuth();
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    area_km2: '',
    population: '',
    foundation_year: '',
    description: ''
  });

  // Загружаем районы при монтировании компонента
  useEffect(() => {
    loadDistricts();
    
    // Восстанавливаем поиск из LocalStorage
    const savedSearch = localStorage.getItem('districtSearch');
    if (savedSearch) {
      setSearchTerm(savedSearch);
    }
  }, []);

  // Сохраняем поиск в LocalStorage при изменении
  useEffect(() => {
    localStorage.setItem('districtSearch', searchTerm);
  }, [searchTerm]);

  const loadDistricts = async () => {
    try {
      const response = await axios.get('/api/district');
      setDistricts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки районов:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingDistrict(null);
    setFormData({
      name: '',
      area_km2: '',
      population: '',
      foundation_year: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (district) => {
    setEditingDistrict(district);
    setFormData({
      name: district.name,
      area_km2: district.area_km2,
      population: district.population,
      foundation_year: district.foundation_year,
      description: district.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот район?')) {
      try {
        await axios.delete(`/api/district/${id}`);
        loadDistricts();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить район');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        area_km2: parseFloat(formData.area_km2),
        population: parseInt(formData.population),
        foundation_year: parseInt(formData.foundation_year)
      };

      if (editingDistrict) {
        await axios.put(`/api/district/${editingDistrict.id}`, data);
      } else {
        await axios.post('/api/district', data);
      }
      
      setIsModalOpen(false);
      loadDistricts();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить район');
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
        <h1 className="page-title">Районы города</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Поиск по названию района..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

        {isAdmin && (
        <button className="btn btn-primary" onClick={handleAdd}>
            + Добавить район
        </button>
        )}

      <div className="cards-grid" style={{ marginTop: '1.5rem' }}>
        {filteredDistricts.map(district => (
          <div key={district.id} className="card">
            <h3 className="card-title">{district.name}</h3>
            <p className="card-text">
              <strong>Площадь:</strong> {district.area_km2} км²
            </p>
            <p className="card-text">
              <strong>Население:</strong> {district.population.toLocaleString()} чел.
            </p>
            <p className="card-text">
              <strong>Год основания:</strong> {district.foundation_year}
            </p>
            {district.description && (
              <p className="card-text">{district.description}</p>
            )}
                {isAdmin && (
                    <div className="actions" style={{ marginTop: '1rem' }}>
                    <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(district)}
                    >
                    Изменить
                    </button>
                    <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(district.id)}
                    >
                    Удалить
                    </button>
                </div>
                )}
          </div>
        ))}
      </div>

      {filteredDistricts.length === 0 && (
        <div className="empty-state">
          <p>Районы не найдены</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDistrict ? 'Редактировать район' : 'Добавить район'}
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
            <label className="form-label">Площадь (км²) *</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              name="area_km2"
              value={formData.area_km2}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Население *</label>
            <input
              type="number"
              className="form-input"
              name="population"
              value={formData.population}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Год основания *</label>
            <input
              type="number"
              className="form-input"
              name="foundation_year"
              value={formData.foundation_year}
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
              {editingDistrict ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Districts;