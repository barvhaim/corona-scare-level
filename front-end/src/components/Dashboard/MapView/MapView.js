import React, {Component} from 'react';

import {Tag, Modal} from 'carbon-components-react';

import * as d3 from 'd3';
import numeral from 'numeral';
import TagCloud from 'react-tag-cloud';
import {randomColor} from 'randomcolor';

import geo from './swiss.geo';
import './index.scss';

const sampleColors = ['#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6'];

class MapView extends Component {
    constructor(props) {
        super(props);

        this.graphRef = React.createRef();
        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        this.drawGraph();
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    _drawMapPath(path, svgContainer, width, height) {
        const that = this;
        const citiesGroup = svgContainer.append("g")
            .attr("id", "map");
        citiesGroup.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("fill", "transparent")
            .attr("width", width)
            .attr("height", height);
        citiesGroup
            .selectAll("path")
            .data(geo.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", function (d) {
                return d.properties.iso_a3;
            })
            .attr("class", "city")
            .attr("fill", function (d) {
                const canton = d.properties.name;
                if (canton in that.props.cantonScore) {
                    return sampleColors[Math.floor(sampleColors.length * (1 - that.props.cantonScore[canton]))];
                } else {
                    return '#e0e0e0';
                }
            })
            .on('mouseover', function (d) {
                const canton = d.srcElement.__data__.properties.name;
                let score = 'N/A';
                if (canton in that.props.cantonScore) score = numeral(that.props.cantonScore[canton]).format('0.0[0000]');
                const tooltipText = canton + " (" + score + ")";
                d3.select('#tooltip').transition().duration(10).style('opacity', 1).text(tooltipText);
                that.props.updateSelectedCanton(canton);
                return false;
            })
            .on('mouseout', function (d) {
                d3.select('#tooltip').style('opacity', 0);
                that.props.updateSelectedCanton(null);
                return false;
            })
            .on('mousemove', function (d) {
                d3.select('#tooltip').style('left', (d.x + 10) + 'px').style('top', (d.y + 10) + 'px');
                return false;
            })
            .on('mousedown.log', function (d) {
                console.log(d.srcElement.__data__.properties.name);
            });
        return citiesGroup;
    }

    drawGraph() {
        const graphContainerDiv = d3.select(this.graphRef.current);
        graphContainerDiv.html("");
        const {width, height} = graphContainerDiv.node().getBoundingClientRect();
        const svgContainer = d3.create("svg")
            .attr("viewBox", [0, 0, width, height]);

        // tooltip
        d3.select('body').append('div').attr('id', 'tooltip').attr('style', 'position: absolute; opacity: 0;');

        const projection = d3.geoMercator();
        projection.fitSize([width, height], geo);

        const path = d3.geoPath().projection(projection);

        this._drawMapPath(path, svgContainer, width, height);

        graphContainerDiv.append(() => svgContainer.node());
    }

    render() {
        return (
            <>
                <Modal
                    passiveModal={true}
                    open={this.state.isModalOpen}
                    size={'lg'}
                    onRequestClose={() => {
                        this.toggleModal();
                    }}
                >
                    <div>
                        <TagCloud style={{
                            fontStyle: 'italic',
                            padding: 0,
                            color: () => randomColor(),
                            height: '30rem'
                        }}>
                            {(this.props.mostCommonTags.map(o => (
                                <div style={{fontSize: (o.value / this.props.totalCovidArticles) * 300 + 15}}>{o.name}</div>
                            )))}
                        </TagCloud>
                    </div>
                </Modal>
                <div className={"bx--col-sm-4"}>
                    <div className={"bx--card map--card"}>
                        <div className={"articles--count"}>
                            <div className={"bx--row"}>
                                <div className={"bx--col title"}>
                                    # of COVID-19 Related Articles
                                </div>
                            </div>
                            <div className={"bx--row"}>
                                <div className={"bx--col value"}>
                                    {numeral(this.props.totalCovidArticles).format('0.0a')}<span
                                    className={'total-value'}> /{numeral(this.props.totalArticles).format('0.0a')}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"bx--row"}>
                            <div className={"bx--col-sm-3"}>
                                <div className={"map--container"} ref={this.graphRef}>
                                </div>
                            </div>
                            <div className={"bx--col-sm-1"}>
                                <div className={"bx--row"}>
                                    <div className={"bx--col"}>
                                        <TopScareLevels
                                            title={"High-scare Locations"}
                                            data={this.props.mostScareLocations.slice(0, 10)}
                                        />
                                    </div>
                                </div>
                                <div className={"bx--row"}>
                                    <div className={"bx--col"}>
                                        <TopRelatedHashtags
                                            title={"Top Related Tags"}
                                            toggleModal={this.toggleModal}
                                            data={this.props.mostCommonTags.slice(0, 10)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const TopScareLevels = (props) => {
    return (
        <>
            <div className={"bx--row"}>
                <div className={"bx--col widget--title"}>
                    {props.title}
                </div>
            </div>
            <div className={"bx--row"}>
                <div className={"bx--col"}>
                    <ul className={"top-scare--list"}>
                        {props.data.map(o => (
                            <li key={o.name}>
                                <div className={"bx--row"}>
                                    <div className={"bx--col-sm-2 key"}>
                                        {o.name}
                                    </div>
                                    <div className={"bx--col-sm-2"}>
                                        <span className={"value"} style={{backgroundColor: _getColorByScore(o.value)}}>
                                            {o.value.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

const TopRelatedHashtags = (props) => {
    return (
        <>
            <div className={"bx--row"}>
                <div className={"bx--col widget--title"}>
                    {props.title}
                </div>
            </div>
            <div className={"bx--row"}>
                <div className={"bx--col"}>
                    {props.data.map(o => (
                        <Tag key={o.name} type={"gray"}>
                            {o.name} ({o.value})
                        </Tag>
                    ))}
                </div>
            </div>
            <div className={"bx--row"}>
                <div className={"bx--col"}>
                    <div style={{fontSize: '.875rem', color: '#0f62fe', textAlign: 'right', paddingRight: '2rem', cursor: 'pointer'}} onClick={() => {
                        props.toggleModal();
                    }} >Show more..</div>
                </div>
            </div>
        </>
    );
};

const _getColorByScore = (score) => {
    const scoreColors = ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'];
    return scoreColors[Math.floor((1 - score) * scoreColors.length)];
};

export default MapView;

