interface IWard {
    ward_id: string;
    ward_name: string;
    ward_type: string;
    district_id: string;
}

class Ward implements IWard {
    ward_id: string;
    ward_name: string;
    ward_type: string;
    district_id: string;

    constructor(ward_id: string, ward_name: string, ward_type: string, district_id: string) {
        this.ward_id = ward_id;
        this.ward_name = ward_name;
        this.ward_type = ward_type;
        this.district_id = district_id;
    }
}

export default Ward