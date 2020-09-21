import React, {Component} from 'react';

import './index.scss';
import numeral from 'numeral';

class StatisticsView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.selectedCanton) {
            return (
                <>
                    <StatisticCard
                        title={"Scare-Level (0-1)"}
                        value={(this.props.selectedCanton in this.props.cantonScore)
                            ? this.props.cantonScore[this.props.selectedCanton] : null }
                    />
                    <StatisticCard
                        title={"# of Articles"}
                        value={this.props.cantonCovidRelatedArticles[this.props.selectedCanton] || 0}
                    />
                    <StatisticCard
                        title={"# of Infected"}
                        value={(this.props.selectedCanton in this.props.covidStatsForCanton)
                            ? this.props.covidStatsForCanton[this.props.selectedCanton].infected : null }
                    />
                    <StatisticCard
                        title={"# of Deaths"}
                        value={(this.props.selectedCanton in this.props.covidStatsForCanton)
                            ? this.props.covidStatsForCanton[this.props.selectedCanton].deaths : null }
                    />
                </>
            );
        } else {
            return (
                <>
                    <StatisticCard
                        title={"Scare-Level (0-1)"}
                        value={null}
                    />
                    <StatisticCard
                        title={"# of Articles"}
                        value={null}
                    />
                    <StatisticCard
                        title={"# of Infected"}
                        value={null}
                    />
                    <StatisticCard
                        title={"# of Deaths"}
                        value={null}
                    />
                </>
            )
        }

    }
}

const StatisticCard = (props) => {
  return (
      <div className={"bx--col"}>
          <div className={"bx--card stat--card"}>
              <div className={"bx--row"}>
                  <div className={"bx--col stat--title"}>
                      {props.title || 'N/A'}
                  </div>
              </div>
              <div className={"bx--row"}>
                  <div className={"bx--col stat--value"}>
                      {(props.value !== null) ? numeral(props.value).format('0.[0]a]') : '-'}
                      <span style={{fontSize: '1rem'}}>{(props.total) ? " /100" : null}</span>
                  </div>
              </div>
          </div>
      </div>
  )
};

export default StatisticsView;
