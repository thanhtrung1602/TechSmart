interface IProvince {
    province_id: string;
    province_name: string;
    province_type: string;
}

class Province implements IProvince {
    province_id: string;
    province_name: string;
    province_type: string;

    constructor(province_id: string, province_name: string, province_type: string) {
        this.province_id = province_id;
        this.province_name = province_name;
        this.province_type = province_type;
    }
}

export default Province