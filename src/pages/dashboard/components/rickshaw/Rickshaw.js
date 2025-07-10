import React from 'react';
import * as d3 from 'd3';
import Rickshaw from 'rickshaw';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from '../../../../config';

if (typeof window !== 'undefined') {
  window.d3 = d3;
}

class RickshawGraph extends React.Component {

  static propTypes = {
    height: PropTypes.number,
  };

  static defaultProps = {
    height: 100,
  };

  constructor(props) {
    super(props);
    this.state = {
      graph: null,
    };
    this.initRickshaw = this.initRickshaw.bind(this);
    this.onResizeRickshaw = this.onResizeRickshaw.bind(this);
  }

  componentDidMount() {
    this.initRickshaw();
    window.addEventListener('resize', this.onResizeRickshaw);
  }

  componentDidUpdate(prevProps) {
    if (this.props.sidebarStatic !== prevProps.sidebarStatic) {
      setTimeout(() => this.onResizeRickshaw(), 1000)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeRickshaw);
  }

  onResizeRickshaw() {
    if (this.state.graph) {
      try {
        this.state.graph.configure({ height: this.props.height });
        this.state.graph.render();
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line
          console.error('Rickshaw resize error:', err);
        }
      }
    }
  }

  initRickshaw() {
    // Defensive: Only initialize if there is data
    const seriesData = [[], []];
    const random = new Rickshaw.Fixtures.RandomData(30);
    for (let i = 0; i < 30; i += 1) {
      random.addData(seriesData);
    }
    if (!seriesData[0].length && !seriesData[1].length) {
      // No data, do not initialize
      return;
    }
    try {
      const graph = new Rickshaw.Graph({
        element: this.rickshawChart,
        height: this.props.height,
        series: [
          {
            color: "rgba(111, 176, 249, 0.5)",
            data: seriesData[0],
            name: 'Uploads',
          }, {
            color: config.app.themeColors.primary,
            data: seriesData[1],
            name: 'Downloads',
          },
        ],
      });
      const hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        xFormatter: x => new Date(x * 1000).toString(),
      });
      hoverDetail.show();
      setInterval(() => {
        random.removeData(seriesData);
        random.addData(seriesData);
        if (graph) {
          try {
            graph.update();
          } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line
              console.error('Rickshaw update error:', err);
            }
          }
        }
      }, 1000);
      graph.render();
      this.setState({ graph });
    } catch (err) {
      // Prevent crash if Rickshaw fails
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line
        console.error('Rickshaw chart error:', err);
      }
    }
  }

  render() {
    return (
      <div
        ref={(r) => {
          this.rickshawChart = r;
        }}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default connect(mapStateToProps)(RickshawGraph);