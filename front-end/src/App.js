import React, {Component} from 'react';
import './app.scss';

import { Content } from 'carbon-components-react';

import Header from "./components/Header/Header";
import StatisticsView from "./components/Dashboard/StatisticsView/StatisticsView";
import MapView from "./components/Dashboard/MapView/MapView";

import { processOutput } from "./data/process_output";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedCanton: null
        };

        this.updateSelectedCanton = this.updateSelectedCanton.bind(this);
    }

    updateSelectedCanton(canton) {
        this.setState({
            selectedCanton: canton
        });
    }

    render() {
        return (
            <>
                <Header />
                <Content className="app-content">
                    <div className="bx--row">
                        <MapView
                            totalArticles={processOutput.total_articles || 'N/A'}
                            totalCovidArticles={processOutput.total_covid_related_articles || 'N/A'}
                            cantonScore={processOutput.canton_score || {}}
                            mostScareLocations={processOutput.most_risky_locations || []}
                            mostCommonTags={processOutput.most_common_tags || []}
                            updateSelectedCanton={this.updateSelectedCanton}
                        />
                    </div>

                    <div className="bx--row">
                        <StatisticsView
                            cantonScore={processOutput.canton_score || {}}
                            covidStatsForCanton={processOutput.covid_stats_for_canton || {}}
                            cantonCovidRelatedArticles={processOutput.canton_covid_related_articles || {}}
                            selectedCanton={this.state.selectedCanton}
                        />
                    </div>
                </Content>
            </>
        );
    }
}


export default App;
