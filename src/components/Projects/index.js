import './index.css'

const Projects = props => {
  const {eachProjectDetails} = props
  const {name, imageUrl} = eachProjectDetails

  return (
    <li className="list-items">
      <img src={imageUrl} alt={name} className="image" />
      <p className="name">{name}</p>
    </li>
  )
}

export default Projects
