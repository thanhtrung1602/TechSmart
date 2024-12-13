interface IDistrict {
    district_id: string;
    district_name: string;
    district_type: string;
    province_id: string;
}

class District implements IDistrict {
    district_id: string;
    district_name: string;
    district_type: string;
    province_id: string;

    constructor(district_id: string, district_name: string, district_type: string, province_id: string) {
        this.district_id = district_id;
        this.district_name = district_name;
        this.district_type = district_type;
        this.province_id = province_id;
    }
}

export default District