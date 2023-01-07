import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Projects from '../Projects'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const status = {
  initials: 'INITIALS',
  loading: 'LOADING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class Home extends Component {
  state = {
    projectsList: [],
    selectTab: categoriesList[0].id,
    apiStatus: status.initials,
  }

  componentDidMount() {
    this.getCourseList()
  }

  getCourseList = async () => {
    const {selectTab} = this.state
    this.setState({apiStatus: status.loading})

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selectTab}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)

      const fetchedData = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({projectsList: fetchedData, apiStatus: status.success})
    } else {
      this.setState({apiStatus: status.failed})
    }
  }

  changeOption = event => {
    this.setState({selectTab: event.target.value}, this.getCourseList)
  }

  loaderView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  retryAgain = () => this.getCourseList()

  failedView = () => (
    <div className="failed-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failed-image"
      />
      <h1 className="failed-heading">Oops! Something Went Wrong</h1>
      <p className="failed-paragraph">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.retryAgain}>
        Retry
      </button>
    </div>
  )

  successfulView = () => {
    const {projectsList} = this.state
    console.log(projectsList)

    return (
      <ul className="unordered-list-container">
        {projectsList.map(eachProject => (
          <Projects eachProjectDetails={eachProject} key={eachProject.id} />
        ))}
      </ul>
    )
  }

  renderProjectDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'LOADING':
        return this.loaderView()

      case 'SUCCESS':
        return this.successfulView()

      case 'FAILED':
        return this.failedView()

      default:
        return null
    }
  }

  render() {
    const {selectTab} = this.state

    return (
      <div className="home-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <select
          className="select"
          onChange={this.changeOption}
          value={selectTab}
        >
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderProjectDetails()}
      </div>
    )
  }
}

export default Home
